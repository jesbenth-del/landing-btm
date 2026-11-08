import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Tokens firmados con HMAC para las cookies de sesión (admin y estudiantes).
 * El campo `aud` separa los dos tipos: una cookie de estudiante nunca sirve
 * como sesión de admin aunque se copie al otro nombre.
 */
export type Audience = "admin" | "estudiante";

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET debe tener al menos 32 caracteres");
  }
  return value;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // timingSafeEqual lanza si los largos difieren: se descarta antes.
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function createToken(aud: Audience, durationMs: number, data: Record<string, string> = {}) {
  const payload = Buffer.from(
    JSON.stringify({ ...data, aud, exp: Date.now() + durationMs }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readToken(
  raw: string | undefined,
  aud: Audience,
): Record<string, string> | null {
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as Record<string, unknown>;
    if (data.aud !== aud || typeof data.exp !== "number" || data.exp <= Date.now()) return null;
    return data as Record<string, string>;
  } catch {
    return null;
  }
}

/** Lee una cookie del encabezado de una Request (para rutas de servidor). */
export function cookieFromRequest(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}
