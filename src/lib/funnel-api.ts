import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { EVENT_CONTENT_NAME, PRIVACY_POLICY_VERSION } from "@/content/evento";
import type { EventoPublico } from "@/lib/evento";

import { eventoVigente, grupoActivo, progressPercentage } from "./server/funnel-config";
import { sendConversionEvent } from "./server/meta-capi";
import { advanceStage, upsertLead } from "./server/leads-repo";
import { requestContext } from "./server/request-context";

export type LeadStage = "captured" | "progress_viewed" | "whatsapp_joined" | "registered";

export interface CreateLeadResponse {
  lead: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneE164: string;
  };
  nextStep: {
    progressPercentage: number;
    whatsappGroupUrl: string;
  };
}

/**
 * Mismas claves que lee el navegador (TRACKING_KEYS en lib/funnel-session.ts
 * y las cookies de lib/pixel.ts). El servidor no confía en eso: descarta lo
 * demás y recorta valores largos.
 */
const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
  "fbp",
  "fbc",
] as const;

const sanitizeTracking = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== "object") return {};
  const source = value as Record<string, unknown>;
  const result: Record<string, string> = {};
  for (const key of TRACKING_KEYS) {
    const raw = source[key];
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (trimmed) result[key] = trimmed.slice(0, 512);
  }
  return result;
};

const nameField = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[\p{L}\p{M}\s'-]+$/u);

const createLeadSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: z.string().trim().toLowerCase().email().max(254),
  countryCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/),
  dialCode: z.string().regex(/^\+\d{1,4}$/),
  phoneNumber: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(6).max(15)),
  privacyAccepted: z.literal(true),
  tracking: z.unknown().optional(),
  /**
   * Milisegundos entre que se mostró el formulario y se envió. No se usa para
   * descartar a nadie (el campo trampa anterior atrapaba a personas reales con
   * gestores de contraseñas): queda guardado para detectar bots después.
   */
  formFillMs: z.number().int().min(0).max(86_400_000).optional(),
});

export const createLead = createServerFn({ method: "POST" })
  .validator(createLeadSchema)
  .handler(async ({ data }): Promise<CreateLeadResponse> => {
    const evento = await eventoVigente();
    const grupo = await grupoActivo();
    const { ipAddress, userAgent } = requestContext();

    let lead: Awaited<ReturnType<typeof upsertLead>>;
    try {
      lead = await upsertLead({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        countryCode: data.countryCode,
        dialCode: data.dialCode,
        phoneNumber: data.phoneNumber,
        tracking: sanitizeTracking(data.tracking),
        group: grupo,
        campana: evento.campana || undefined,
        ipAddress,
        userAgent,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
        formFillMs: data.formFillMs,
      });
    } catch (error) {
      console.error("[createLead] MongoDB falló:", error);
      throw new Error("No pudimos guardar tus datos. Inténtalo de nuevo en unos minutos.");
    }

    console.info(`[createLead] Lead capturado · inscripción #${lead.submissionCount}`);

    return {
      lead: {
        id: lead._id.toHexString(),
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phoneE164: lead.phoneE164,
      },
      nextStep: {
        progressPercentage: progressPercentage(),
        whatsappGroupUrl: evento.whatsappGroupUrl,
      },
    };
  });

/**
 * Evento estándar de Meta para cada etapa. Tienen que ser estándar para que
 * se pueda optimizar la campaña por ellos sin conversiones personalizadas.
 */
const STAGE_EVENTS: Partial<Record<LeadStage, string>> = {
  whatsapp_joined: "Lead",
  registered: "CompleteRegistration",
};

const advanceStageSchema = z.object({
  /** ObjectId de MongoDB. */
  id: z.string().regex(/^[a-f0-9]{24}$/i),
  stage: z.enum(["progress_viewed", "whatsapp_joined", "registered"]),
  /** Mismo ID que el evento del pixel del navegador, para que Meta deduplique. */
  eventId: z.string().min(1).max(128).optional(),
  eventSourceUrl: z.string().url().max(512).optional(),
});

export const advanceLeadStage = createServerFn({ method: "POST" })
  .validator(advanceStageSchema)
  .handler(async ({ data }) => {
    let result: Awaited<ReturnType<typeof advanceStage>>;
    try {
      result = await advanceStage(data.id, data.stage);
    } catch (error) {
      console.error("[advanceLeadStage] MongoDB falló:", error);
      throw new Error("No se pudo actualizar el registro");
    }
    if (!result) throw new Error("Lead no encontrado");

    const { lead, firstTime } = result;

    const eventName = STAGE_EVENTS[data.stage];
    // Solo la primera vez: recargar /registro no debe contar otra conversión.
    if (eventName && firstTime) {
      const { ipAddress, userAgent } = requestContext();
      // Se espera (con timeout) porque en serverless lo que queda pendiente
      // después de responder puede no ejecutarse nunca.
      await sendConversionEvent({
        eventName,
        // Sin eventId del navegador se usa el del lead mezclado con el evento,
        // para que Lead y CompleteRegistration no compartan ID.
        eventId: data.eventId ?? `${lead._id.toHexString()}-${eventName}`,
        email: lead.email,
        phoneE164: lead.phoneE164,
        firstName: lead.firstName,
        lastName: lead.lastName,
        countryCode: lead.countryCode,
        fbp: lead.tracking?.fbp,
        fbc: lead.tracking?.fbc,
        fbclid: lead.tracking?.fbclid,
        ipAddress,
        userAgent,
        eventSourceUrl: data.eventSourceUrl,
        customData: { content_name: EVENT_CONTENT_NAME },
      });
    }

    return { ok: true, firstTime };
  });

/** Lo que la landing necesita en cada visita: fecha, hora y zona. Público. */
export const getEventoPublico = createServerFn({ method: "GET" }).handler(
  async (): Promise<EventoPublico> => {
    const evento = await eventoVigente();
    return { inicio: evento.inicio, hora: evento.hora, zona: evento.zona };
  },
);
