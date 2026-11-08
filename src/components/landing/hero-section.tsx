import founderBtm from "@/assets/founder-btm.jpg";
import { LeadForm } from "@/components/funnel/lead-form";
import { HERO, MARCA } from "@/content/evento";
import type { TextosDelEvento } from "@/lib/evento";

import { Aurora, MarketChart, WordReveal } from "./fx";

const MERCADOS = ["Forex", "XAUUSD", "Índices"] as const;

/** Quién enseña: es parte de la oferta. */
function MentorBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`items-center gap-4 [animation:fade-up_.8s_ease-out_1s_both] ${className}`}>
      <div className="relative shrink-0">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-transparent opacity-70 blur-sm" />
        <img
          src={founderBtm}
          alt={`${MARCA.mentor}, ${MARCA.rolMentor}`}
          className="relative size-14 rounded-full border-2 border-background object-cover object-top"
          width={1080}
          height={1350}
          loading="eager"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[0.62rem] tracking-[0.26em] text-primary uppercase">Lo dicta</p>
        <p className="mt-0.5 text-lg leading-tight font-semibold">{MARCA.mentor}</p>
        <p className="text-sm text-white/50">{MARCA.rolMentor}</p>
      </div>
    </div>
  );
}

/**
 * Héroe con el formulario y quién enseña, todo sobre el pliegue: quien llega
 * desde una pauta tiene que poder registrarse sin hacer scroll.
 */
export function HeroSection({ evento }: { evento: TextosDelEvento }) {
  const antes = HERO.tituloAntes.split(" ").length;
  const resaltado = HERO.tituloResaltado.split(" ").length;

  return (
    <section id="top" className="relative isolate overflow-x-clip">
      {/* Fondo: auroras, rejilla en perspectiva y el gráfico de velas. */}
      <Aurora />
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-x-0 bottom-0 h-[55%] origin-bottom [transform:perspective(600px)_rotateX(60deg)] [mask-image:linear-gradient(to_top,black,transparent_85%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_70%_45%,black_20%,transparent_75%)]"
      >
        <MarketChart className="absolute inset-0 h-full w-full opacity-60 lg:left-[28%] lg:w-[80%]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent lg:via-background/40"
      />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-6xl content-center gap-8 px-5 pt-24 pb-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-14 lg:pt-32 xl:gap-x-20">
        {/* Copy */}
        <div className="min-w-0 lg:self-center">
          <span className="animate-fade-up glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[0.68rem] font-medium tracking-[0.18em] text-white/80 uppercase">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {HERO.insignia}
            {evento.hasDate ? <span className="text-primary">· {evento.dates}</span> : null}
          </span>

          <h1 className="mt-5 sm:mt-7 text-[2.7rem] leading-[0.98] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-[4.6rem]">
            <WordReveal text={HERO.tituloAntes} className="text-fade" baseDelay={150} />
            <WordReveal
              text={HERO.tituloResaltado}
              className="text-shimmer"
              baseDelay={150}
              start={antes}
            />
            <WordReveal
              text={HERO.tituloDespues}
              className="text-fade"
              baseDelay={150}
              start={antes + resaltado}
            />
          </h1>

          <p className="mt-5 max-w-xl sm:mt-7 text-base leading-relaxed text-pretty text-white/60 [animation:fade-up_.8s_ease-out_.7s_both] sm:text-lg">
            {HERO.bajada}
          </p>

          <div className="mt-8 hidden flex-wrap items-center gap-2 [animation:fade-up_.8s_ease-out_.85s_both] sm:flex">
            {MERCADOS.map((m) => (
              <span
                key={m}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-white/70"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Autoridad: en escritorio va con el copy. */}
          <MentorBadge className="mt-10 hidden lg:flex" />
        </div>

        {/* Formulario */}
        <div
          id="registro"
          className="border-beam glass relative min-w-0 scroll-mt-24 rounded-[28px] p-6 [animation:fade-up_.9s_cubic-bezier(.2,.7,.2,1)_.4s_both] sm:p-8 lg:self-center"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 size-56 -translate-x-1/2 rounded-full bg-primary/20 blur-[80px]"
          />
          <div className="relative">
            <p className="text-2xl font-semibold tracking-tight">{HERO.formularioTitulo}</p>
            <p className="mt-1.5 text-sm text-white/55">{HERO.formularioBajada}</p>

            <div className="mt-6">
              <LeadForm startsAt={evento.startsAt} />
            </div>

            <p className="mt-5 flex items-start justify-center gap-2 text-center text-[11px] leading-snug text-white/45 sm:text-xs">
              <span aria-hidden>🔒</span>
              <span>{evento.datesLine}</span>
            </p>
          </div>
        </div>

        {/* En móvil va después del formulario, para que este suba hacia el pliegue. */}
        <MentorBadge className="flex lg:hidden" />
      </div>

      {/* Indicador de scroll */}
      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-white/30 uppercase lg:flex"
      >
        <span>Desliza</span>
        <span className="h-10 w-px overflow-hidden bg-white/10">
          <span className="block h-1/2 w-full bg-primary motion-safe:animate-bounce" />
        </span>
      </div>
    </section>
  );
}
