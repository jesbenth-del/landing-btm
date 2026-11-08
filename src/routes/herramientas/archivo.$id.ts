import { Readable } from "node:stream";

import { createFileRoute } from "@tanstack/react-router";

import { cookieFromRequest, readToken } from "@/lib/server/signed-token";
import { studentFromRequest } from "@/lib/server/student-session";
import { openToolFile } from "@/lib/server/tools-repo";

/** Tipos que el navegador sabe mostrar: se abren en una pestaña en vez de descargarse. */
const INLINE = /^(application\/pdf|image\/|video\/|audio\/|text\/plain)/;

/**
 * Entrega el archivo de una herramienta. Solo para estudiantes con acceso
 * vigente (o el admin, que además puede ver las no publicadas). El archivo
 * sale de GridFS en streaming, sin cargarlo entero en memoria.
 */
export const Route = createFileRoute("/herramientas/archivo/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const isAdmin = readToken(cookieFromRequest(request, "btm_admin"), "admin") !== null;
        if (!isAdmin && !(await studentFromRequest(request))) {
          return new Response("No tienes acceso a este archivo.", { status: 401 });
        }

        const file = await openToolFile(params.id, isAdmin);
        if (!file) return new Response("Archivo no encontrado.", { status: 404 });

        const forceDownload = new URL(request.url).searchParams.has("descargar");
        const disposition = !forceDownload && INLINE.test(file.mimeType) ? "inline" : "attachment";
        const asciiName = file.fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");

        return new Response(Readable.toWeb(file.stream) as ReadableStream, {
          headers: {
            "Content-Type": file.mimeType,
            "Content-Length": String(file.size),
            "Content-Disposition": `${disposition}; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
            // Contenido privado: que ningún proxy o CDN lo guarde.
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
