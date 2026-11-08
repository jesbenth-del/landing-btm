import { AGENDA_BASE, ZONA_HORARIA } from "@/content/evento";

/** Lo que la landing necesita de la convocatoria vigente (público). */
export interface EventoPublico {
  /** ISO 8601 con desfase ("2026-11-15T10:00:00-05:00"), o "" si no hay fecha. */
  inicio: string;
  /** "10:00 a.m.", tal como se escribe en la landing. */
  hora: string;
  zona: string;
}

/*
  Los meses van escritos a mano en vez de con toLocaleDateString porque el
  resultado de esa función depende del ICU del entorno: el servidor y el
  navegador pueden formatear distinto y React marcaría el desajuste al
  hidratar.
*/
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

/** "10:00" → "10:00 a.m.", "19:30" → "7:30 p.m.". Sin Intl, por lo mismo que los meses. */
export function horaLegible(hhmm: string): string {
  const m = /^(\d{2}):(\d{2})/.exec(hhmm);
  if (!m) return "";
  const h = Number(m[1]);
  const sufijo = h < 12 ? "a.m." : "p.m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m[2]} ${sufijo}`;
}

/** La hora local que trae un ISO "2026-11-15T10:00:00-05:00": "10:00". */
export const horaDelIso = (iso: string) => /T(\d{2}:\d{2})/.exec(iso)?.[1] ?? "";

/** La fecha local que trae un ISO: "2026-11-15". */
export const fechaDelIso = (iso: string) => /^(\d{4}-\d{2}-\d{2})/.exec(iso)?.[1] ?? "";

/** Arma el ISO con el desfase de la zona anunciada. */
export const isoDesde = (fecha: string, hora: string) =>
  `${fecha}T${hora}:00${ZONA_HORARIA.desfase}`;

/**
 * Día y mes contando `offset` días desde el arranque.
 *
 * Solo mira la parte de fecha del ISO y hace la suma en UTC: construir un
 * `Date` completo y leerlo con `getDate()` daría el día en la zona horaria de
 * quien ejecuta el código (un servidor en UTC movería las 7 p.m. de Colombia
 * a la madrugada del día siguiente).
 */
function diaDelEvento(inicio: string, offset: number): { day: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(inicio);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + offset));
  return { day: shifted.getUTCDate(), month: shifted.getUTCMonth() };
}

const formatDay = (d: { day: number; month: number }) => `${d.day} de ${MONTHS[d.month]}`;

/**
 * Une los días del evento: «15 de noviembre», «15 y 16 de noviembre» o
 * «30 de noviembre y 1 de diciembre». Nunca se nombran días de la semana: una
 * fecha concreta se apunta en el calendario, «próximo sábado» envejece mal si
 * el anuncio sigue circulando.
 */
function unirFechas(dias: { day: number; month: number }[]): string {
  if (dias.length === 0) return "próxima fecha";
  if (dias.length === 1) return formatDay(dias[0]);
  const mismoMes = dias.every((d) => d.month === dias[0].month);
  if (mismoMes) {
    const numeros = dias.map((d) => d.day);
    const last = numeros.pop();
    return `${numeros.join(", ")} y ${last} de ${MONTHS[dias[0].month]}`;
  }
  const textos = dias.map(formatDay);
  const last = textos.pop();
  return `${textos.join(", ")} y ${last}`;
}

/** Todos los textos de la landing que dependen de la fecha y la hora. */
export function textosDelEvento(evento: EventoPublico) {
  const offsets = [...new Set(AGENDA_BASE.map((s) => s.offsetDias))].sort((a, b) => a - b);
  const dias = offsets
    .map((o) => diaDelEvento(evento.inicio, o))
    .filter((d): d is { day: number; month: number } => d !== null);
  const dates = unirFechas(dias);

  return {
    startsAt: evento.inicio,
    time: evento.hora,
    timezone: evento.zona,
    dates,
    hasDate: dias.length > 0,
    datesLine: dias.length
      ? `Evento 100% online y gratuito | ${dates} a las ${evento.hora} (${evento.zona})`
      : "Evento 100% online y gratuito | Fecha por confirmar",
    agenda: AGENDA_BASE.map((sesion) => {
      const d = diaDelEvento(evento.inicio, sesion.offsetDias);
      return { ...sesion, day: d ? formatDay(d) : "Fecha por confirmar" };
    }),
  };
}

export type TextosDelEvento = ReturnType<typeof textosDelEvento>;
