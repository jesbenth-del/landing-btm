import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseAdmin } from "./server/supabase-admin";

const leadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  whatsapp: z.string().min(1).max(50),
  studyTime: z.string().optional(),
  struggle: z.string().max(2000).optional(),
  interest: z.string().optional(),
  source: z.enum(["form", "lead_magnet"]).optional(),
  website: z.string().max(0).optional(),
  privacyAccepted: z.literal(true).optional(),
  privacyPolicyVersion: z.string().optional(),
  privacyAcceptedAt: z.string().datetime().optional(),
  sourcePage: z.string().url().optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .validator(leadSchema)
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
