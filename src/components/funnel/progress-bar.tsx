import { useCountUp } from "@/lib/use-count-up";

/** Barra que cuenta de 0 hasta `value` al montar (79% en /procesando, 100% en /registro). */
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const displayed = useCountUp(value, { duration: 2200, initialDisplay: "zero" });

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4">
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {label ?? "Progreso"}
        </span>
        <span className="text-4xl leading-none font-semibold text-primary tabular-nums">
          {displayed}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={displayed}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progreso del registro"}
        className="relative mt-3 h-3 w-full overflow-hidden rounded-full border border-border bg-secondary"
      >
        <div
          className="relative h-full overflow-hidden rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${displayed}%` }}
        >
          <span className="animate-progress-shine absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}
