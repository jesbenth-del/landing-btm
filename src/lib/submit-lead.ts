import { createServerFn } from "@tanstack/react-start";

import { getSupabaseAdmin } from "./server/supabase-admin";

type LeadInput = {
  name: string;
  email: string;
  whatsapp: string;
  studyTime?: string;
  struggle?: string;
  interest?: string;
  source?: "form" | "lead_magnet";
  website?: string;
  privacyAccepted?: true;
  privacyPolicyVersion?: string;
  privacyAcceptedAt?: string;
  sourcePage?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

function validateLead(data: LeadInput): LeadInput {
  if (!data.name || data.name.length > 200) throw new Error("Datos inválidos");
  if (!/^\\S+@\\S+\\.\\S+$/.test(data.email)) throw new Error("Datos inválidos");
  if (!data.whatsapp || data.whatsapp.length > 50) throw new Error("Datos inválidos");
  if (data.struggle && data.struggle.length > 2000) throw new Error("Datos inválidos");
  if (data.website && data.website.length > 0) return data;
  if (data.privacyAccepted !== undefined && data.privacyAccepted !== true) {
    throw new Error("Datos inválidos");
  }
  return data;
}

export const submitLead = createServerFn({ method: "POST" })
  .validator((data: LeadInput) => validateLead(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      study_time: data.studyTime ?? null,
      struggle: data.struggle ?? null,
      interest: data.interest ?? null,
      privacy_accepted: data.privacyAccepted ?? null,
      privacy_policy_version: data.privacyPolicyVersion ?? null,
      privacy_accepted_at: data.privacyAcceptedAt ?? null,
      source_page: data.sourcePage ?? null,
      source: data.source ?? "form",
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
    });

    if (error) {
      console.error("[submitLead] Supabase insert failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error("No se pudo guardar el lead");
    }
    return { ok: true };
  });
