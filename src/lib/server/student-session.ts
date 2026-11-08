import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

import { isEmailAllowed } from "./tools-repo";
import { cookieFromRequest, createToken, readToken } from "./signed-token";

/**
 * Sesión de los estudiantes en /herramientas. La cookie guarda el correo,
 * pero en cada petición se vuelve a comprobar que siga en la lista: quitar un
 * correo desde el panel corta el acceso de inmediato, aunque la cookie siga
 * vigente.
 */
export const STUDENT_COOKIE = "btm_estudiante";
const DURACION_MS = 30 * 24 * 60 * 60 * 1000;

/** Mensaje con el que el cliente reconoce que hay que volver a pedir el correo. */
export const NO_ACCESS = "NO_ACCESS";

export function startStudentSession(email: string) {
  setCookie(STUDENT_COOKIE, createToken("estudiante", DURACION_MS, { email }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_MS / 1000,
  });
}

export function endStudentSession() {
  deleteCookie(STUDENT_COOKIE, { path: "/" });
}

async function emailFromRaw(raw: string | undefined): Promise<string | null> {
  const email = readToken(raw, "estudiante")?.email;
  if (!email) return null;
  return (await isEmailAllowed(email)) ? email : null;
}

/** El correo del estudiante con sesión válida y acceso vigente, o null. */
export async function currentStudent(): Promise<string | null> {
  return emailFromRaw(getCookie(STUDENT_COOKIE));
}

/** Igual que `currentStudent`, para rutas de servidor que reciben la Request. */
export async function studentFromRequest(request: Request): Promise<string | null> {
  return emailFromRaw(cookieFromRequest(request, STUDENT_COOKIE));
}

export async function requireStudent(): Promise<string> {
  const email = await currentStudent();
  if (!email) throw new Error(NO_ACCESS);
  return email;
}
