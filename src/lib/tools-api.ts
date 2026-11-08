import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "./server/admin-session";
import {
  currentStudent,
  endStudentSession,
  requireStudent,
  startStudentSession,
} from "./server/student-session";
import {
  addAllowedEmails,
  createLinkTool,
  deleteTool,
  finishUpload,
  isEmailAllowed,
  listAllowedEmails,
  listTools,
  normalizeEmail,
  removeAllowedEmail,
  saveUploadPart,
  touchAccess,
  updateTool,
} from "./server/tools-repo";

export type { AllowedEmail, LinkType, PublicTool } from "./server/tools-repo";

/** Mensaje con el que el cliente reconoce que el estudiante perdió el acceso. */
export const NO_ACCESS = "NO_ACCESS";
export const hasNoAccess = (error: unknown) =>
  error instanceof Error && error.message.includes(NO_ACCESS);

/** Tamaño de cada parte al subir: con base64 queda bajo el límite de 4,5 MB de Vercel. */
export const UPLOAD_PART_BYTES = 2.5 * 1024 * 1024;
export const MAX_FILE_MB = 25;

const LINK_TYPES = ["sheets", "docs", "slides", "drive", "video", "otro"] as const;
const idSchema = z.string().regex(/^[a-f0-9]{24}$/i);

/* ---------- Estudiantes ---------- */

export const studentLogin = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().trim().toLowerCase().email().max(254) }))
  .handler(async ({ data }) => {
    // Espera fija: probar correos a ciegas resulta lento.
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!(await isEmailAllowed(data.email))) {
      throw new Error(
        "Este correo no tiene acceso. Usa el correo con el que te registraste en la comunidad o escríbenos.",
      );
    }
    startStudentSession(normalizeEmail(data.email));
    await touchAccess(data.email);
    return { ok: true };
  });

export const studentLogout = createServerFn({ method: "POST" }).handler(async () => {
  endStudentSession();
  return { ok: true };
});

/** La sesión del estudiante (si su correo sigue autorizado) y las herramientas publicadas. */
export const getStudentArea = createServerFn({ method: "GET" }).handler(async () => {
  const email = await currentStudent();
  if (!email) return { email: null, tools: [] };
  return { email, tools: await listTools(true) };
});

export const fetchStudentTools = createServerFn({ method: "GET" }).handler(async () => {
  await requireStudent();
  return listTools(true);
});

/* ---------- Admin: correos ---------- */

export const adminListEmails = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  return listAllowedEmails();
});

export const adminAddEmails = createServerFn({ method: "POST" })
  .validator(
    z.object({
      /** Texto libre: correos separados por comas, espacios o saltos de línea. */
      raw: z.string().max(200_000),
      note: z.string().trim().max(120).optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAdmin();
    const candidates = data.raw.split(/[\s,;]+/).filter(Boolean);
    const valid = candidates.filter((c) => z.string().email().safeParse(c.trim()).success);
    const invalid = candidates.filter((c) => !valid.includes(c));
    const result = await addAllowedEmails(valid, data.note || undefined);
    return { ...result, invalid };
  });

export const adminRemoveEmail = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    requireAdmin();
    await removeAllowedEmail(data.email);
    return { ok: true };
  });

/* ---------- Admin: herramientas ---------- */

export const adminListTools = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  return listTools(false);
});

const textFields = {
  title: z.string().trim().min(2, "Escribe un título").max(120),
  description: z.string().trim().max(600),
  published: z.boolean(),
};

export const adminCreateLink = createServerFn({ method: "POST" })
  .validator(
    z.object({
      ...textFields,
      url: z.string().trim().url("El enlace no es válido").max(2000),
      linkType: z.enum(LINK_TYPES),
    }),
  )
  .handler(async ({ data }) => {
    requireAdmin();
    await createLinkTool(data);
    return { ok: true };
  });

export const adminUploadPart = createServerFn({ method: "POST" })
  .validator(
    z.object({
      uploadId: z.string().uuid(),
      index: z.number().int().min(0).max(20),
      base64: z.string().max(4_000_000),
    }),
  )
  .handler(async ({ data }) => {
    requireAdmin();
    await saveUploadPart(data.uploadId, data.index, Buffer.from(data.base64, "base64"));
    return { ok: true };
  });

export const adminFinishUpload = createServerFn({ method: "POST" })
  .validator(
    z.object({
      ...textFields,
      uploadId: z.string().uuid(),
      totalParts: z.number().int().min(1).max(20),
      fileName: z.string().trim().min(1).max(200),
      mimeType: z.string().max(200),
    }),
  )
  .handler(async ({ data }) => {
    requireAdmin();
    await finishUpload({
      ...data,
      mimeType: data.mimeType || "application/octet-stream",
    });
    return { ok: true };
  });

export const adminUpdateTool = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: idSchema,
      title: textFields.title.optional(),
      description: textFields.description.optional(),
      published: z.boolean().optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAdmin();
    const { id, ...changes } = data;
    await updateTool(id, changes);
    return { ok: true };
  });

export const adminDeleteTool = createServerFn({ method: "POST" })
  .validator(z.object({ id: idSchema }))
  .handler(async ({ data }) => {
    requireAdmin();
    await deleteTool(data.id);
    return { ok: true };
  });
