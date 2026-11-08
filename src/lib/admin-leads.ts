import type { AdminLead } from "./admin-api";
import { COUNTRIES } from "./countries";
import type { LeadStage } from "./funnel-api";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export const STAGE_LABELS: Record<LeadStage, string> = {
  captured: "Capturado",
  progress_viewed: "Vio el paso 2",
  whatsapp_joined: "Entró a WhatsApp",
  registered: "Registrado",
};

/** Encabezados en el mismo orden que las columnas de la tabla en pantalla. */
export const EXPORT_COLUMNS = [
  "Fecha",
  "Convocatoria",
  "Grupo",
  "Etapa",
  "Inscripciones",
  "Última inscripción",
  "Nombre",
  "Apellido",
  "Correo",
  "Teléfono",
  "País",
  "Origen",
  ...UTM_KEYS,
];

export const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

/**
 * De dónde llegó el lead, en una sola celda. `utm_source` primero; si falta,
 * la cookie del pixel distingue un clic en anuncio de Meta sin UTM de una
 * visita orgánica (el enlace de la bio, una historia, alguien que lo escribió).
 */
export function originOf(lead: AdminLead): string {
  const source = lead.tracking?.utm_source?.trim();
  if (source) return source;
  if (lead.tracking?.fbc || lead.tracking?.fbclid) return "Meta (sin UTM)";
  return "Orgánico";
}

export const countryName = (code: string) =>
  COUNTRIES.find((country) => country.code === code)?.name ?? code;

/**
 * Misma información que la tabla. Los UTM vacíos quedan como cadena vacía (no
 * "—"): en una hoja de cálculo un guion no es lo mismo que una celda vacía.
 */
export function toExportRow(lead: AdminLead): string[] {
  return [
    dateFormatter.format(new Date(lead.created_at)),
    lead.campana ?? "",
    lead.whatsapp_group_label ?? "",
    STAGE_LABELS[lead.stage] ?? lead.stage,
    String(lead.submission_count),
    lead.last_submitted_at ? dateFormatter.format(new Date(lead.last_submitted_at)) : "",
    lead.first_name,
    lead.last_name,
    lead.email,
    `${lead.dial_code} ${lead.phone_number}`,
    countryName(lead.country_code),
    originOf(lead),
    ...UTM_KEYS.map((key) => lead.tracking?.[key] ?? ""),
  ];
}
