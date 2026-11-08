import { useSyncExternalStore } from "react";

const UNITS = [
  { key: "days", label: "d" },
  { key: "hours", label: "h" },
  { key: "minutes", label: "m" },
  { key: "seconds", label: "s" },
] as const;

/** Un tic por segundo. */
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

/*
  La instantánea va en segundos enteros, no en milisegundos: React consulta
  `getSnapshot` varias veces por render y un valor que cambia en cada llamada
  lo haría renderizar en bucle.
*/
const getSnapshot = () => Math.floor(Date.now() / 1000);

/** En el servidor no hay reloj del visitante; el 0 marca «todavía no». */
const getServerSnapshot = () => 0;

function remaining(targetSec: number, nowSec: number) {
  const total = Math.max(0, targetSec - nowSec);
  return {
    total,
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  };
}

/**
 * Cuenta atrás hasta el arranque del evento, en una línea compacta para ir
 * pegada al botón de inscripción: la urgencia funciona justo donde se decide.
 *
 * Se calcula con el reloj del visitante, así que no se pinta en el servidor.
 * Si `startsAt` está vacío, es inválido o ya pasó, no devuelve nada: un
 * contador en cero destruye más confianza de la que genera la urgencia.
 */
export function Countdown({ startsAt, className = "" }: { startsAt: string; className?: string }) {
  const nowSec = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const targetMs = startsAt ? Date.parse(startsAt) : NaN;
  if (Number.isNaN(targetMs) || nowSec === 0) return null;

  const left = remaining(Math.floor(targetMs / 1000), nowSec);
  if (left.total <= 0) return null;

  return (
    <p className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 ${className}`}>
      <span className="text-[0.65rem] font-medium tracking-[0.2em] text-primary uppercase">
        Empieza en
      </span>
      <span className="flex items-center gap-1 text-sm leading-none font-semibold text-foreground tabular-nums">
        {UNITS.map(({ key, label }, index) => (
          <span key={key} className="flex items-baseline">
            {index > 0 && (
              <span aria-hidden="true" className="mr-1 text-primary/60">
                :
              </span>
            )}
            <span className="rounded bg-secondary px-1.5 py-1">
              {String(left[key]).padStart(2, "0")}
              <span className="ml-0.5 text-[0.6rem] font-normal text-muted-foreground">
                {label}
              </span>
            </span>
          </span>
        ))}
      </span>
    </p>
  );
}
