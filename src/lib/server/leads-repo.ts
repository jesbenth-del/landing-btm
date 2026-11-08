import { ObjectId, type Collection, type Filter, type WithId } from "mongodb";

import type { AdminLead, LeadFilters, LeadSort } from "@/lib/admin-api";
import type { LeadStage } from "@/lib/funnel-api";

import { getDb } from "./mongo";

/* ---------- Modelo ---------- */

interface WhatsappGroup {
  /** Código de invitación del enlace: identificador estable del grupo (la cohorte). */
  code: string;
  label: string;
}

/**
 * Una entrada por cada vez que el lead envió el formulario: si vuelve con
 * otro número, por otra pauta o en otra convocatoria, no se pierde.
 */
interface LeadSubmission {
  at: Date;
  phoneE164: string;
  tracking: Record<string, string>;
  whatsappGroup?: WhatsappGroup;
  campana?: string;
}

export interface LeadDoc {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  dialCode: string;
  phoneNumber: string;
  phoneE164: string;
  stage: LeadStage;
  tracking: Record<string, string>;
  submissionCount: number;
  lastSubmittedAt: Date;
  submissions: LeadSubmission[];
  /** Último grupo / convocatoria; los filtros usan el historial. */
  whatsappGroup?: WhatsappGroup;
  campana?: string;
  privacyPolicyVersion: string;
  privacyAcceptedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  progressViewedAt?: Date;
  whatsappJoinedAt?: Date;
  registeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfigDoc {
  _id: string;
  campana?: string;
  whatsappGroupUrl?: string;
  /** ISO 8601 con desfase: 2026-11-15T10:00:00-05:00 */
  inicio?: string;
  updatedAt: Date;
}

const leads = async (): Promise<Collection<LeadDoc>> => (await getDb()).collection<LeadDoc>("leads");
const config = async () => (await getDb()).collection<ConfigDoc>("funnel_config");

/** Valores especiales de los filtros (deben coincidir con lib/admin-api.ts). */
const NO_CAMPAIGN = "__organico__";
const NO_GROUP = "__sin_grupo__";
const NO_CAMPANA = "__sin_campana__";

/* ---------- Captura ---------- */

export interface UpsertLeadInput {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  dialCode: string;
  phoneNumber: string;
  tracking: Record<string, string>;
  group?: WhatsappGroup;
  campana?: string;
  ipAddress?: string;
  userAgent?: string;
  privacyPolicyVersion: string;
  /** Cuánto tardó en llenar el formulario; muy poco tiempo sugiere un bot. */
  formFillMs?: number;
}

const isDuplicateKey = (error: unknown) =>
  typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;

/**
 * Un correo, una ficha: si ya existe se actualizan sus datos con los del
 * último envío y se suma una entrada al historial.
 *
 * Dos envíos simultáneos del mismo correo pueden chocar en el índice único
 * (E11000); como para entonces el documento ya existe, reintentar una vez
 * resuelve.
 */
export async function upsertLead(input: UpsertLeadInput, isRetry = false): Promise<WithId<LeadDoc>> {
  const now = new Date();
  const email = input.email.toLowerCase();
  const phoneE164 = `${input.dialCode}${input.phoneNumber}`;
  const hasTracking = Object.keys(input.tracking).length > 0;

  try {
    const lead = await (
      await leads()
    ).findOneAndUpdate(
      { email },
      {
        $set: {
          firstName: input.firstName,
          lastName: input.lastName,
          countryCode: input.countryCode,
          dialCode: input.dialCode,
          phoneNumber: input.phoneNumber,
          phoneE164,
          lastSubmittedAt: now,
          privacyPolicyVersion: input.privacyPolicyVersion,
          privacyAcceptedAt: now,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          updatedAt: now,
          ...(input.formFillMs !== undefined ? { formFillMs: input.formFillMs } : {}),
          ...(hasTracking ? { tracking: input.tracking } : {}),
          ...(input.group ? { whatsappGroup: input.group } : {}),
          ...(input.campana ? { campana: input.campana } : {}),
        },
        $inc: { submissionCount: 1 },
        $push: {
          submissions: {
            at: now,
            phoneE164,
            tracking: input.tracking,
            ...(input.group ? { whatsappGroup: input.group } : {}),
            ...(input.campana ? { campana: input.campana } : {}),
          },
        },
        $setOnInsert: {
          email,
          stage: "captured",
          createdAt: now,
          ...(hasTracking ? {} : { tracking: {} }),
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    if (!lead) throw new Error("El upsert no devolvió el lead");
    return lead;
  } catch (error) {
    if (isRetry || !isDuplicateKey(error)) throw error;
    return upsertLead(input, true);
  }
}

/* ---------- Avance de etapa ---------- */

const STAGES: LeadStage[] = ["captured", "progress_viewed", "whatsapp_joined", "registered"];
const STAGE_TIMESTAMP = {
  progress_viewed: "progressViewedAt",
  whatsapp_joined: "whatsappJoinedAt",
  registered: "registeredAt",
} as const;

/**
 * Avanza la etapa sin retroceder nunca (volver a /procesando después de
 * registrarse no degrada al lead) y dice si es la primera vez que se llega a
 * ella, para no repetir el evento de la Conversions API.
 */
export async function advanceStage(
  id: string,
  stage: keyof typeof STAGE_TIMESTAMP,
): Promise<{ lead: WithId<LeadDoc>; firstTime: boolean } | null> {
  if (!ObjectId.isValid(id)) return null;
  const field = STAGE_TIMESTAMP[stage];
  const now = new Date();

  // Update con pipeline: la comparación de etapas y el "solo la primera vez"
  // ocurren atómicamente en el servidor de Mongo.
  const before = await (
    await leads()
  ).findOneAndUpdate(
    { _id: new ObjectId(id) },
    [
      {
        $set: {
          stage: {
            $cond: [
              { $gt: [STAGES.indexOf(stage), { $indexOfArray: [STAGES, "$stage"] }] },
              stage,
              "$stage",
            ],
          },
          [field]: { $ifNull: [`$${field}`, now] },
          updatedAt: now,
        },
      },
    ],
    { returnDocument: "before" },
  );

  if (!before) return null;
  return { lead: before, firstTime: before[field] == null };
}

/* ---------- Tablero ---------- */

/** "AAAA-MM-DD" en hora Colombia → instante. */
const bogota = (date: string, plusDays = 0) => {
  const d = new Date(`${date}T00:00:00-05:00`);
  d.setUTCDate(d.getUTCDate() + plusDays);
  return d;
};

function buildFilter(f: LeadFilters): Filter<LeadDoc> {
  const filter: Filter<LeadDoc> = {};
  const and: Filter<LeadDoc>[] = [];

  if (f.campaign === NO_CAMPAIGN) {
    and.push({ "tracking.utm_campaign": { $in: [null, ""] } });
  } else if (f.campaign) {
    and.push({ "tracking.utm_campaign": f.campaign });
  }

  if (f.onlyReturning) and.push({ submissionCount: { $gt: 1 } });

  // En el historial: quien se inscribió en dos convocatorias sale en las dos.
  if (f.whatsappGroup === NO_GROUP) {
    and.push({ "submissions.whatsappGroup.code": { $exists: false } });
  } else if (f.whatsappGroup) {
    and.push({ "submissions.whatsappGroup.code": f.whatsappGroup });
  }

  if (f.campana === NO_CAMPANA) {
    and.push({ "submissions.campana": { $exists: false } });
  } else if (f.campana) {
    and.push({ "submissions.campana": f.campana });
  }

  if (f.dateFrom || f.dateTo) {
    const createdAt: { $gte?: Date; $lt?: Date } = {};
    if (f.dateFrom) createdAt.$gte = bogota(f.dateFrom);
    if (f.dateTo) createdAt.$lt = bogota(f.dateTo, 1);
    and.push({ createdAt });
  }

  if (and.length) filter.$and = and;
  return filter;
}

const SORTS: Record<LeadSort, Record<string, 1 | -1>> = {
  recent: { createdAt: -1 },
  // Desempata por fecha para que el orden sea estable entre páginas.
  submissions: { submissionCount: -1, createdAt: -1 },
};

const iso = (d?: Date) => (d ? d.toISOString() : "");

/** Mismo formato que consume la tabla del admin. */
function toAdminLead(doc: WithId<LeadDoc>): AdminLead {
  return {
    id: doc._id.toHexString(),
    first_name: doc.firstName,
    last_name: doc.lastName,
    email: doc.email,
    country_code: doc.countryCode,
    dial_code: doc.dialCode,
    phone_number: doc.phoneNumber,
    phone_e164: doc.phoneE164,
    stage: doc.stage,
    tracking: doc.tracking ?? {},
    submission_count: doc.submissionCount ?? 1,
    last_submitted_at: iso(doc.lastSubmittedAt),
    whatsapp_group_code: doc.whatsappGroup?.code ?? null,
    whatsapp_group_label: doc.whatsappGroup?.label ?? null,
    campana: doc.campana ?? null,
    created_at: iso(doc.createdAt),
    submissions: (doc.submissions ?? []).map((s) => ({
      at: iso(s.at),
      phone_e164: s.phoneE164 ?? null,
      tracking: s.tracking ?? {},
      whatsapp_group_code: s.whatsappGroup?.code ?? null,
      whatsapp_group_label: s.whatsappGroup?.label ?? null,
      campana: s.campana ?? null,
    })),
  };
}

export async function searchLeads(
  filters: LeadFilters,
  sort: LeadSort,
  page: number,
  limit: number | null,
): Promise<{ items: AdminLead[]; total: number }> {
  const col = await leads();
  const filter = buildFilter(filters);
  let cursor = col.find(filter).sort(SORTS[sort] ?? SORTS.recent);
  if (limit) cursor = cursor.skip((Math.max(1, page) - 1) * limit).limit(limit);

  const [docs, total] = await Promise.all([cursor.toArray(), col.countDocuments(filter)]);
  return { items: docs.map(toAdminLead), total };
}

/**
 * Campañas de anuncios (utm_campaign) dentro del resto de filtros activos: el
 * número junto a cada opción es el que va a salir en la tabla. La campaña se
 * excluye a propósito, que es lo que ofrece este selector.
 */
export async function campaignCounts(filters: LeadFilters) {
  const col = await leads();
  const scope = buildFilter({ ...filters, campaign: undefined });

  const [items, withoutCampaign] = await Promise.all([
    col
      .aggregate<{ campaign: string; count: number; lastSeenAt: Date }>([
        { $match: { $and: [scope, { "tracking.utm_campaign": { $exists: true, $nin: [null, ""] } }] } },
        {
          $group: {
            _id: "$tracking.utm_campaign",
            count: { $sum: 1 },
            lastSeenAt: { $max: "$createdAt" },
          },
        },
        { $sort: { lastSeenAt: -1 } },
        { $project: { _id: 0, campaign: "$_id", count: 1, lastSeenAt: 1 } },
      ])
      .toArray(),
    col.countDocuments({ $and: [scope, { "tracking.utm_campaign": { $in: [null, ""] } }] }),
  ]);

  return { items: items.map((i) => ({ ...i, lastSeenAt: iso(i.lastSeenAt) })), withoutCampaign };
}

/** Grupos de WhatsApp vistos en el historial, el más reciente primero. */
export async function groupCounts() {
  const col = await leads();
  const [items, withoutGroup] = await Promise.all([
    col
      .aggregate<{ code: string; label: string; count: number; lastSeenAt: Date }>([
        { $unwind: "$submissions" },
        { $match: { "submissions.whatsappGroup.code": { $exists: true } } },
        { $sort: { "submissions.at": 1 } },
        {
          $group: {
            _id: "$submissions.whatsappGroup.code",
            // La etiqueta puede cambiar entre convocatorias: gana la más reciente.
            label: { $last: "$submissions.whatsappGroup.label" },
            leads: { $addToSet: "$_id" },
            lastSeenAt: { $max: "$submissions.at" },
          },
        },
        { $sort: { lastSeenAt: -1 } },
        { $project: { _id: 0, code: "$_id", label: 1, count: { $size: "$leads" }, lastSeenAt: 1 } },
      ])
      .toArray(),
    col.countDocuments({ "submissions.whatsappGroup.code": { $exists: false } }),
  ]);
  return { items: items.map((i) => ({ ...i, lastSeenAt: iso(i.lastSeenAt) })), withoutGroup };
}

/** Convocatorias vistas en el historial, la más reciente primero. */
export async function campanaCounts() {
  const col = await leads();
  const [items, withoutCampana] = await Promise.all([
    col
      .aggregate<{ campana: string; count: number; lastSeenAt: Date }>([
        { $unwind: "$submissions" },
        { $match: { "submissions.campana": { $exists: true, $ne: "" } } },
        {
          $group: {
            _id: "$submissions.campana",
            leads: { $addToSet: "$_id" },
            lastSeenAt: { $max: "$submissions.at" },
          },
        },
        { $sort: { lastSeenAt: -1 } },
        { $project: { _id: 0, campana: "$_id", count: { $size: "$leads" }, lastSeenAt: 1 } },
      ])
      .toArray(),
    col.countDocuments({ "submissions.campana": { $exists: false } }),
  ]);
  return { items: items.map((i) => ({ ...i, lastSeenAt: iso(i.lastSeenAt) })), withoutCampana };
}

export async function leadStats() {
  const col = await leads();
  const [grouped, returning] = await Promise.all([
    col.aggregate<{ _id: LeadStage; count: number }>([{ $group: { _id: "$stage", count: { $sum: 1 } } }]).toArray(),
    col.countDocuments({ submissionCount: { $gt: 1 } }),
  ]);
  const byStage = Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<LeadStage, number>;
  for (const { _id, count } of grouped) if (_id in byStage) byStage[_id] = count;
  const total = Object.values(byStage).reduce((sum, n) => sum + n, 0);
  return { total, returning, byStage };
}

/* ---------- Convocatoria ---------- */

export async function readConfig(): Promise<ConfigDoc | null> {
  return (await config()).findOne({ _id: "actual" });
}

export async function writeConfig(values: { campana: string; whatsappGroupUrl: string; inicio: string }) {
  await (
    await config()
  ).updateOne({ _id: "actual" }, { $set: { ...values, updatedAt: new Date() } }, { upsert: true });
}
