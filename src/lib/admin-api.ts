import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  endAdminSession,
  hasAdminSession,
  passwordMatches,
  requireAdmin,
  startAdminSession,
} from "./server/admin-session";
import {
  eventoParaEditar,
  grupoActivo,
  invalidarEventoVigente,
  eventoVigente,
} from "./server/funnel-config";
import {
  campaignCounts,
  campanaCounts,
  groupCounts,
  leadStats,
  searchLeads,
  writeConfig,
} from "./server/leads-repo";
import { isoDesde } from "./evento";
import type { LeadStage } from "./funnel-api";

/** Mensaje con el que se reconoce un 401 en el cliente (ver lib/server/admin-session.ts). */
export const UNAUTHORIZED = "UNAUTHORIZED";

export const isUnauthorized = (error: unknown) =>
  error instanceof Error && error.message.includes(UNAUTHORIZED);

/** Valores especiales de los filtros: piden los leads SIN ese dato. */
export const NO_CAMPAIGN = "__organico__";
export const NO_GROUP = "__sin_grupo__";
export const NO_CAMPANA = "__sin_campana__";

export interface LeadSubmission {
  at: string;
  phone_e164: string | null;
  tracking: Record<string, string> | null;
  whatsapp_group_code: string | null;
  whatsapp_group_label: string | null;
  campana: string | null;
}

export interface AdminLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  dial_code: string;
  phone_number: string;
  phone_e164: string;
  stage: LeadStage;
  tracking: Record<string, string> | null;
  submission_count: number;
  last_submitted_at: string;
  whatsapp_group_code: string | null;
  whatsapp_group_label: string | null;
  campana: string | null;
  created_at: string;
  submissions: LeadSubmission[];
}

export type LeadSort = "recent" | "submissions";

const filtersSchema = z.object({
  campaign: z.string().max(200).optional(),
  whatsappGroup: z.string().max(200).optional(),
  campana: z.string().max(200).optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  onlyReturning: z.boolean().optional(),
});

export type LeadFilters = z.infer<typeof filtersSchema>;

/* ---------- Sesión ---------- */

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    // Un poco de espera fija para que probar contraseñas a ciegas sea lento.
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!passwordMatches(data.password)) throw new Error("Contraseña inválida");
    startAdminSession();
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  endAdminSession();
  return { ok: true };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => ({
  authenticated: hasAdminSession(),
}));

/* ---------- Leads ---------- */

/** Envuelve la consulta para no filtrar detalles de la base al navegador. */
async function db<T>(label: string, query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error(`[admin] ${label} falló:`, error);
    throw new Error("No se pudo consultar la base de datos");
  }
}

export const fetchLeads = createServerFn({ method: "POST" })
  .validator(
    z.object({
      filters: filtersSchema,
      sort: z.enum(["recent", "submissions"]),
      page: z.number().int().min(1),
      /** null = todos, sin paginar (vista "Todos" y exportación). */
      limit: z.number().int().min(1).max(100).nullable(),
    }),
  )
  .handler(async ({ data }) => {
    requireAdmin();
    return db("searchLeads", () => searchLeads(data.filters, data.sort, data.page, data.limit));
  });

export interface CampaignSummary {
  campaign: string;
  count: number;
  lastSeenAt: string;
}

export const fetchCampaigns = createServerFn({ method: "POST" })
  .validator(filtersSchema)
  .handler(async ({ data }) => {
    requireAdmin();
    return db("campaignCounts", () => campaignCounts(data));
  });

export interface WhatsappGroupSummary {
  code: string;
  label: string;
  count: number;
  lastSeenAt: string;
}

export const fetchWhatsappGroups = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const [counts, active] = await Promise.all([
    db("groupCounts", groupCounts),
    grupoActivo(),
  ]);
  return { ...counts, active: active ?? null };
});

export interface CampanaSummary {
  campana: string;
  count: number;
  lastSeenAt: string;
}

export const fetchCampanas = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const [counts, evento] = await Promise.all([
    db("campanaCounts", campanaCounts),
    eventoVigente(),
  ]);
  return { ...counts, vigente: evento.campana || null };
});

export const fetchStats = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  return db("leadStats", leadStats);
});

/* ---------- Convocatoria ---------- */

export const fetchEventoConfig = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  return eventoParaEditar();
});

export const saveEventoConfig = createServerFn({ method: "POST" })
  .validator(
    z.object({
      campana: z
        .string()
        .trim()
        .min(1, "El nombre de la convocatoria es obligatorio")
        .max(60, "Máximo 60 caracteres"),
      whatsappGroupUrl: z
        .string()
        .trim()
        // go.wha.link es el enlace corto que da WhatsApp para grupos y comunidades.
        .regex(
          /^https:\/\/(chat\.whatsapp\.com|go\.wha\.link)\/[A-Za-z0-9]+/,
          "El enlace debe ser una invitación de WhatsApp (https://chat.whatsapp.com/…)",
        ),
      fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha va como AAAA-MM-DD"),
      hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora va como HH:MM (24 horas)"),
    }),
  )
  .handler(async ({ data }) => {
    requireAdmin();
    await db("writeConfig", () =>
      writeConfig({
        campana: data.campana,
        whatsappGroupUrl: data.whatsappGroupUrl,
        inicio: isoDesde(data.fecha, data.hora),
      }),
    );
    invalidarEventoVigente();
    return eventoParaEditar();
  });

/* ---------- Exportación ---------- */

/**
 * Arma un .xlsx a partir de encabezados y filas ya formateadas en el cliente
 * (la misma fuente que la tabla en pantalla). Devuelve base64: las server
 * functions viajan como JSON.
 */
export const buildLeadsXlsx = createServerFn({ method: "POST" })
  .validator(
    z.object({
      columns: z.array(z.string()).max(50),
      rows: z.array(z.array(z.string())).max(100_000),
    }),
  )
  .handler(async ({ data }) => {
    requireAdmin();
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Leads");
    sheet.addRow(data.columns);
    sheet.getRow(1).font = { bold: true };
    data.rows.forEach((row) => sheet.addRow(row));
    sheet.columns.forEach((column) => {
      column.width = 22;
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return { base64: Buffer.from(buffer).toString("base64") };
  });
