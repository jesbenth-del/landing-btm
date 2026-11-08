/*
  Wrapper del pixel de Meta. El base code se inyecta en `routes/__root.tsx`
  cuando existe VITE_META_PIXEL_ID; aquí solo se disparan eventos. Todo es
  no-op si el pixel no cargó (ID sin configurar, bloqueador de anuncios),
  porque `window.fbq` simplemente no existe.
*/

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Eventos estándar de Meta que usa el embudo: son los únicos que se pueden
 * elegir como objetivo de optimización sin crear una conversión personalizada.
 */
export type StandardEvent = "PageView" | "Lead" | "CompleteRegistration";

export { EVENT_CONTENT_NAME } from "@/content/evento";

/** ID compartido con el evento gemelo de la Conversions API, para que Meta deduplique. */
export function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // `randomUUID` exige contexto seguro; en http:// (pruebas en LAN) no existe.
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

const fire = (
  method: "track" | "trackCustom",
  name: string,
  params: Record<string, unknown>,
  eventId?: string,
) => {
  if (typeof window === "undefined" || !window.fbq) return;
  const args: unknown[] = [method, name, params];
  if (eventId) args.push({ eventID: eventId });
  window.fbq(...args);
};

export function trackPixelEvent(
  name: StandardEvent,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  fire("track", name, params, eventId);
}

export function trackPixelCustomEvent(
  name: string,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  fire("trackCustom", name, params, eventId);
}

const readCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

/**
 * Cookies que planta el propio pixel: `_fbp` identifica el navegador y `_fbc`
 * guarda el clic del anuncio. Se guardan con el lead para que la Conversions
 * API pueda emparejar los eventos que dispara después el servidor.
 */
export function readMetaCookies(): Record<string, string> {
  const fbp = readCookie("_fbp");
  const fbc = readCookie("_fbc");
  return {
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
  };
}
