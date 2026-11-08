import { ZONA_HORARIA } from "@/content/evento";
import { fechaDelIso, horaDelIso, horaLegible } from "@/lib/evento";

import { readConfig } from "./leads-repo";

export interface EventoVigente {
  campana: string;
  whatsappGroupUrl: string;
  /** ISO 8601 con desfase, o "" si no hay fecha configurada. */
  inicio: string;
  hora: string;
  zona: string;
  /** Cuándo se guardó por última vez en /admin; null = sale del entorno. */
  actualizado: string | null;
}

/**
 * Cuánto se confía en la copia en memoria. Se lee en cada lead y en cada
 * visita a la landing; un cambio en /admin tarda a lo sumo esto en verse en
 * otras instancias (la que guarda la invalida al instante).
 */
const VIGENCIA_MS = 10_000;
let copia: { valor: EventoVigente; hasta: number } | null = null;

export function invalidarEventoVigente() {
  copia = null;
}

/**
 * La convocatoria vigente: lo guardado en /admin y, campo por campo, lo del
 * entorno para lo que nunca se haya guardado. Si MongoDB no responde se usa
 * solo el entorno: la landing nunca se cae por no poder leer la fecha.
 */
export async function eventoVigente(): Promise<EventoVigente> {
  if (copia && copia.hasta > Date.now()) return copia.valor;

  let guardado: Awaited<ReturnType<typeof readConfig>> = null;
  let leido = true;
  try {
    guardado = await readConfig();
  } catch (error) {
    leido = false;
    console.error("[eventoVigente] No se pudo leer funnel_config:", error);
  }

  const inicio = guardado?.inicio ?? process.env.EVENT_STARTS_AT?.trim() ?? "";
  const valor: EventoVigente = {
    campana: guardado?.campana ?? process.env.WHATSAPP_GROUP_LABEL?.trim() ?? "",
    whatsappGroupUrl: guardado?.whatsappGroupUrl ?? process.env.WHATSAPP_GROUP_URL?.trim() ?? "",
    inicio,
    hora: horaLegible(horaDelIso(inicio)),
    zona: ZONA_HORARIA.etiqueta,
    actualizado: guardado?.updatedAt ? guardado.updatedAt.toISOString() : null,
  };

  // Si la base falló, no se cachea el respaldo: se reintenta en la próxima visita.
  if (!leido) return valor;

  copia = { valor, hasta: Date.now() + VIGENCIA_MS };
  return valor;
}

/** Lo que muestra el formulario de /admin: la fecha y la hora por separado. */
export async function eventoParaEditar() {
  const v = await eventoVigente();
  return {
    campana: v.campana,
    whatsappGroupUrl: v.whatsappGroupUrl,
    fecha: fechaDelIso(v.inicio),
    hora: horaDelIso(v.inicio),
    horaLegible: v.hora,
    zona: v.zona,
    actualizado: v.actualizado,
  };
}

export const progressPercentage = () => {
  const value = Number.parseInt(process.env.FUNNEL_PROGRESS ?? "79", 10);
  return Number.isFinite(value) ? Math.min(99, Math.max(1, value)) : 79;
};

/**
 * Código de invitación de un enlace de WhatsApp: lo que va después del último
 * `/`, sin querystring. Identifica al grupo (la cohorte) aunque el enlace se
 * copie con parámetros de más.
 */
export function extractGroupCode(url: string): string | undefined {
  const cleaned = url.trim().split("?")[0].replace(/\/+$/, "");
  const code = cleaned.split("/").pop();
  return code && code !== "chat.whatsapp.com" && code !== "go.wha.link" ? code : undefined;
}

/** El grupo al que entra quien se registra ahora mismo, o undefined si no hay enlace. */
export async function grupoActivo(): Promise<{ code: string; label: string } | undefined> {
  const evento = await eventoVigente();
  const url = evento.whatsappGroupUrl.trim();
  if (!url) return undefined;
  const code = extractGroupCode(url);
  if (!code) return undefined;
  return { code, label: evento.campana || code };
}
