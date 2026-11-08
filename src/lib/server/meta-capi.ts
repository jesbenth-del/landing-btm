import { createHash } from "node:crypto";

const GRAPH_API_VERSION = "v21.0";

export interface ConversionEventInput {
  eventName: string;
  /** Compartido con el evento del pixel del navegador, para que Meta deduplique. */
  eventId: string;
  email: string;
  phoneE164: string;
  firstName?: string;
  lastName?: string;
  /** ISO de 2 letras. */
  countryCode?: string;
  /** Cookie `_fbp` del pixel: identifica el navegador. */
  fbp?: string;
  /** Cookie `_fbc` del pixel: el clic del anuncio con su timestamp real. */
  fbc?: string;
  /** `tracking.fbclid` del lead; solo se usa si no llegó la cookie `_fbc`. */
  fbclid?: string;
  ipAddress?: string;
  userAgent?: string;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** Meta exige minúsculas, sin espacios ni acentos antes de hashear. */
const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Manda un evento a la Conversions API de Meta. Nunca lanza: un problema con
 * Meta no debe romper el flujo real del lead.
 */
export async function sendConversionEvent(input: ConversionEventInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) return;

  const userData: Record<string, unknown> = {
    em: [sha256(normalize(input.email))],
    ph: [sha256(input.phoneE164.replace(/\D/g, ""))],
  };

  // Cada campo extra sube la calidad de emparejamiento que reporta Meta.
  if (input.firstName) userData.fn = [sha256(normalize(input.firstName))];
  if (input.lastName) userData.ln = [sha256(normalize(input.lastName))];
  if (input.countryCode) userData.country = [sha256(normalize(input.countryCode))];
  if (input.ipAddress) userData.client_ip_address = input.ipAddress;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;

  if (input.fbc) {
    userData.fbc = input.fbc;
  } else if (input.fbclid) {
    // Sin cookie se reconstruye: fb.<subdomain_index>.<timestamp>.<fbclid>.
    userData.fbc = `fb.1.${Date.now()}.${input.fbclid}`;
  }

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_id: input.eventId,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
        user_data: userData,
        ...(input.customData ? { custom_data: input.customData } : {}),
      },
    ],
    ...(process.env.META_CAPI_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE }
      : {}),
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      // No se loguea el body: puede reflejar el access_token en errores de Meta.
      console.warn(`[meta-capi] Meta respondió ${response.status} para "${input.eventName}"`);
    }
  } catch (error) {
    console.warn(
      `[meta-capi] No se pudo enviar "${input.eventName}": ${
        error instanceof Error ? error.message : "error desconocido"
      }`,
    );
  }
}
