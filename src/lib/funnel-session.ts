import type { CreateLeadResponse } from "./funnel-api";

/**
 * Datos del lead que viajan entre los pasos del embudo (/ → /procesando →
 * /registro). Viven en sessionStorage: se borran al cerrar la pestaña.
 */
export const FUNNEL_SESSION_KEY = "btm-funnel-session";

export interface FunnelSession {
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneE164: string;
  progressPercentage: number;
  whatsappGroupUrl: string;
}

export const toFunnelSession = (response: CreateLeadResponse): FunnelSession => ({
  leadId: response.lead.id,
  firstName: response.lead.firstName,
  lastName: response.lead.lastName,
  email: response.lead.email,
  phoneE164: response.lead.phoneE164,
  progressPercentage: response.nextStep.progressPercentage,
  whatsappGroupUrl: response.nextStep.whatsappGroupUrl,
});

const listeners = new Set<() => void>();

/** Notifica a los hooks suscritos: `sessionStorage` no emite eventos en la misma pestaña. */
const notify = () => listeners.forEach((listener) => listener());

export function subscribeToFunnelSession(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function saveFunnelSession(session: FunnelSession) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(FUNNEL_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Modo privado / almacenamiento bloqueado: el embudo sigue sin sesión.
  }
  notify();
}

export function parseFunnelSession(raw: string | null): FunnelSession | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FunnelSession;
  } catch {
    return null;
  }
}

/**
 * Marca que un evento de conversión ya se disparó en el navegador para este
 * lead. Evita contar otra conversión si la persona recarga /registro.
 */
export function markTrackedOnce(leadId: string, event: string): boolean {
  const key = `btm-funnel-tracked:${leadId}:${event}`;
  try {
    if (window.sessionStorage.getItem(key)) return false;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // Sin almacenamiento no se puede recordar; se dispara igual.
  }
  return true;
}

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
];

export function readTrackingParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return TRACKING_KEYS.reduce<Record<string, string>>((acc, key) => {
    const value = params.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});
}
