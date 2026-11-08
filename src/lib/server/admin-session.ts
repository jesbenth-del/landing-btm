import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

import { createToken, readToken, safeEqual } from "./signed-token";

/**
 * Sesión del panel /admin: una cookie httpOnly firmada. El token nunca es
 * legible desde JavaScript, así que un XSS no puede robarlo.
 */
const COOKIE_NAME = "btm_admin";
const DURACION_MS = 12 * 60 * 60 * 1000;

/** Mensaje con el que el cliente reconoce que hay que volver al login. */
export const UNAUTHORIZED = "UNAUTHORIZED";

export function passwordMatches(received: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD no está configurada");
  return safeEqual(received, expected);
}

export function startAdminSession() {
  setCookie(COOKIE_NAME, createToken("admin", DURACION_MS, { role: "admin" }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: DURACION_MS / 1000,
  });
}

export function endAdminSession() {
  deleteCookie(COOKIE_NAME, { path: "/" });
}

export function hasAdminSession(): boolean {
  return readToken(getCookie(COOKIE_NAME), "admin") !== null;
}

/** Corta la server function si no hay sesión válida. */
export function requireAdmin() {
  if (!hasAdminSession()) throw new Error(UNAUTHORIZED);
}
