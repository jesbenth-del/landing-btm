import { Activity, Check, Compass, Layers, Plus, Shuffle, X } from "lucide-react";

import founderBtm from "@/assets/founder-btm.jpg";
import { CtaLink } from "@/components/funnel/fields";
import {
  APRENDIZAJES,
  AUDIENCIA,
  AVISO_LEGAL,
  CIERRE,
  DIFERENCIA,
  FAQ_ITEMS,
  FILTRO,
  MARCA,
  MENTOR,
  PROOF_STATS,
} from "@/content/evento";
import type { TextosDelEvento } from "@/lib/evento";
import { useCountUp } from "@/lib/use-count-up";
import { useInView } from "@/lib/use-in-view";

import { Aurora, SpotlightCard } from "./fx";
import { Band, Reveal, RichText, SectionHeading } from "./primitives";

/* ---------- 2. Credibilidad inmediata ---------- */

/**
 * Cinta de cifras justo debajo del héroe: quien llega desde una pauta no
 * conoce la marca, y la prueba tiene que aparecer antes de decidir si se
 * registra. El contenido va duplicado para que el bucle no tenga costura.
 */
export function ProofStrip() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.015]">
      <div className="relative flex overflow-hidden py-7 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="animate-ticker flex shrink-0 items-center gap-14 pr-14">
          {[0, 1].map((copy) =>
            PROOF_STATS.map((stat) => (
              <li
                key={`${copy}-${stat.label}`}
                className="flex shrink-0 items-center gap-4"
                aria-hidden={copy === 1 || undefined}
              >
                <span className="text-3xl leading-none font-semibold tracking-tight whitespace-nowrap text-primary sm:text-4xl">
                  {stat.value}
                </span>
                <span className="max-w-[11rem] text-xs leading-tight tracking-wide text-white/50 uppercase">
                  {stat.label}
                </span>
                <span aria-hidden className="ml-14 text-primary/40">
                  ✦
                </span>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 3. ¿Eres tú? ---------- */

const PERFIL_ICONS = [Layers, Shuffle, Activity, Compass];
/** Disposición tipo bento: tarjetas de distinto ancho dan ritmo a la rejilla. */
const PERFIL_SPANS = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4"];

export function AudienceSection() {
  return (
    <Band grid id="para-quien">
      <SectionHeading
        eyebrow={AUDIENCIA.eyebrow}
        title={AUDIENCIA.titulo}
        highlight={AUDIENCIA.resaltado}
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-pretty text-white/55 sm:text-lg">
        {AUDIENCIA.intro}
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {AUDIENCIA.perfiles.map((profile, index) => {
          const Icon = PERFIL_ICONS[index % PERFIL_ICONS.length];
          return (
            <Reveal
              key={profile.title}
              delay={index * 90}
              className={`h-full ${PERFIL_SPANS[index % PERFIL_SPANS.length]}`}
            >
              <SpotlightCard className="group h-full overflow-hidden p-7 sm:p-8">
                <span className="absolute top-6 right-7 font-mono text-xs text-white/25">
                  0{index + 1}
                </span>
                <span className="grid size-12 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">{profile.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
                  {profile.description}
                </p>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>

      <p className="mx-auto mt-14 max-w-2xl text-center text-base leading-relaxed text-pretty text-white/50">
        {AUDIENCIA.cierre}
      </p>
    </Band>
  );
}

/* ---------- 4. Por qué esta sesión y no otra ---------- */

export function DifferenceSection() {
  return (
    <Band tone="muted">
      <div className="scroll-scale">
        <div className="border-beam glass relative overflow-hidden rounded-[32px] px-6 py-16 text-center sm:px-14 sm:py-24">
          <Aurora className="opacity-70" />
          <div
            aria-hidden
            className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
          />
          <SectionHeading
            title={DIFERENCIA.titulo}
            highlight={DIFERENCIA.resaltado}
            className="relative"
          />
          <p className="relative mx-auto mt-8 max-w-3xl text-base leading-relaxed text-pretty text-white/60 sm:text-xl">
            <RichText parts={DIFERENCIA.parrafo} />
          </p>
          <div className="relative mt-12">
            <CtaLink>{DIFERENCIA.boton}</CtaLink>
          </div>
        </div>
      </div>
    </Band>
  );
}

/* ---------- 5. Qué se lleva ---------- */

/**
 * Encabezado fijo a la izquierda y pasos a la derecha, unidos por una línea
 * que se llena a medida que se hace scroll.
 */
export function LearningsSection({ evento }: { evento: TextosDelEvento }) {
  return (
    <Band id="aprenderas">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow={APRENDIZAJES.eyebrow}
            title={APRENDIZAJES.titulo}
            highlight={APRENDIZAJES.resaltado}
            align="left"
          />
          {evento.hasDate && (
            <p className="mt-6 max-w-md text-base text-white/55">
              Paso a paso, el {evento.dates} a las {evento.time} ({evento.timezone}).
            </p>
          )}
          <p className="mt-8 max-w-md text-lg font-medium text-balance text-white/80">
            {APRENDIZAJES.cierreAntes}{" "}
            <span className="text-primary">{APRENDIZAJES.cierreResaltado}</span>
            {APRENDIZAJES.cierreDespues}
          </p>
          <div className="mt-10 hidden lg:block">
            <CtaLink>Reservar mi cupo</CtaLink>
          </div>
        </div>

        <ol className="relative">
          {/* Riel y su relleno ligado al scroll. */}
          <span aria-hidden className="absolute top-2 bottom-2 left-[23px] w-px bg-white/10" />
          <span
            aria-hidden
            className="scroll-fill absolute top-2 bottom-2 left-[23px] w-px bg-gradient-to-b from-primary via-primary to-transparent shadow-[0_0_12px_var(--color-primary)]"
          />
          {APRENDIZAJES.items.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 60} className="relative pb-6 pl-16 last:pb-0">
              <span className="absolute top-1 left-0 grid size-12 place-items-center rounded-2xl border border-primary/30 bg-background font-mono text-sm font-semibold text-primary shadow-[0_0_30px_-8px_var(--color-primary)]">
                0{index + 1}
              </span>
              <SpotlightCard className="p-6 sm:p-7">
                <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/55 sm:text-base">
                  {item.description}
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </ol>
      </div>
    </Band>
  );
}

/* ---------- 6. Quién enseña ---------- */

function MentorStat({
  value,
  suffix,
  label,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const displayed = useCountUp(value, { trigger: inView, decimals });
  // Coma decimal a mano: toLocaleString puede diferir entre servidor y navegador.
  const formatted = displayed.toFixed(decimals).replace(".", ",");

  return (
    <div ref={ref} className="glass h-full rounded-2xl p-4 text-center sm:p-5">
      <p className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
        {formatted}
        {suffix}
      </p>
      <p className="mt-1.5 text-[11px] leading-snug text-white/50 sm:text-xs">{label}</p>
    </div>
  );
}

const MENTOR_CHIPS = [
  { label: "Estructura", className: "-left-4 top-[12%] sm:-left-8" },
  { label: "Contexto", className: "-right-3 top-[42%] sm:-right-8" },
  { label: "Validación", className: "-left-2 bottom-[32%] sm:-left-6" },
];

export function MentorSection() {
  return (
    <Band tone="muted" id="mentor">
      <div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal variant="scale" className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-sm">
            {/* Aro de luz girando detrás de la foto. */}
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[40px] opacity-60 blur-2xl [animation:spin-angle_8s_linear_infinite] [background:conic-gradient(from_var(--angle),transparent,oklch(0.9_0.18_110/0.5),transparent_40%)]"
            />
            <div className="border-beam relative overflow-hidden rounded-[32px] border border-white/10 bg-card">
              <img
                src={founderBtm}
                alt={`${MARCA.mentor}, ${MARCA.rolMentor}`}
                className="aspect-[4/5] w-full object-cover"
                width={1080}
                height={1350}
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 pt-20">
                <p className="text-xl font-semibold">{MARCA.mentor}</p>
                <p className="text-sm text-white/60">{MARCA.rolMentor}</p>
              </div>
            </div>
            {MENTOR_CHIPS.map((chip, i) => (
              <span
                key={chip.label}
                className={`glass absolute z-10 rounded-full px-3.5 py-1.5 text-xs font-medium text-white/85 motion-safe:animate-bounce ${chip.className}`}
                style={{ animationDuration: "4s", animationDelay: `${i * 0.7}s` }}
              >
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary align-middle" />
                {chip.label}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="order-1 min-w-0 lg:order-2">
          <SectionHeading
            eyebrow={MENTOR.eyebrow}
            title={MENTOR.titulo}
            highlight={MENTOR.resaltado}
            align="left"
          />
          <ul className="mt-10 flex flex-col gap-5">
            {MENTOR.puntos.map((point, i) => (
              <Reveal as="li" key={point} delay={i * 80} className="flex gap-4">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <p className="text-base leading-relaxed text-white/75">{point}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {MENTOR.stats.map((stat) => (
              <MentorStat key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>

      <Reveal className="mt-16">
        <SpotlightCard className="p-8 sm:p-12">
          <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
            {MENTOR.destacadoTitulo}
          </p>
          <p className="mt-5 text-xl leading-snug font-medium tracking-tight text-pretty text-white/85 sm:text-3xl">
            “{MENTOR.destacado}”
          </p>
        </SpotlightCard>
      </Reveal>
    </Band>
  );
}

/* ---------- 7. Filtro honesto ---------- */

export function FilterMatrixSection() {
  return (
    <Band>
      <SectionHeading eyebrow={FILTRO.eyebrow} title={FILTRO.titulo} highlight={FILTRO.resaltado} />

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className="h-full rounded-3xl border border-white/[0.07] bg-white/[0.015] p-7 sm:p-9">
            <p className="flex items-center gap-3 text-sm font-semibold tracking-wide text-white/50 uppercase">
              <span className="grid size-7 place-items-center rounded-full bg-white/5">
                <X className="size-3.5" />
              </span>
              Esto NO es para ti si…
            </p>
            <ul className="mt-8 space-y-5">
              {FILTRO.filas.map((row) => (
                <li key={row.no} className="flex gap-3 text-white/45">
                  <X aria-hidden className="mt-1 size-4 shrink-0 text-white/25" />
                  <span className="text-sm leading-relaxed line-through decoration-white/15 sm:text-base">
                    {row.no}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={120} className="h-full">
          <div className="border-beam glass relative h-full overflow-hidden rounded-3xl p-7 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/15 blur-[80px]"
            />
            <p className="relative flex items-center gap-3 text-sm font-semibold tracking-wide text-primary uppercase">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              Esto SÍ es para ti si…
            </p>
            <ul className="relative mt-8 space-y-5">
              {FILTRO.filas.map((row) => (
                <li key={row.yes} className="flex gap-3">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed text-white/85 sm:text-base">
                    {row.yes}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-14 text-center">
        <CtaLink>{FILTRO.boton}</CtaLink>
      </div>
    </Band>
  );
}

/* ---------- 8. Preguntas frecuentes ---------- */

export function FaqSection() {
  return (
    <Band tone="muted" width="narrow" id="faq">
      <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus" highlight="dudas." />
      <div className="mt-12 space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.question} delay={i * 50}>
            <details className="group glass rounded-2xl px-6 py-5 transition-colors open:border-primary/25 sm:px-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium tracking-tight marker:content-none sm:text-lg">
                {item.question}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 transition-all duration-300 group-open:rotate-45 group-open:border-primary/40 group-open:bg-primary group-open:text-primary-foreground">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="mt-4 pr-10 text-sm leading-relaxed text-white/55 sm:text-base">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </Band>
  );
}

/* ---------- 9. Agenda y último llamado ---------- */

/**
 * Cierre: agenda y último llamado juntos. Quien llega hasta aquí ya está
 * convencido; solo le falta saber cuándo es y dónde hacer clic.
 */
export function FinalCtaSection({ evento }: { evento: TextosDelEvento }) {
  return (
    <section className="relative isolate overflow-hidden">
      <Aurora fadeEdges />
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-x-0 bottom-0 h-2/3 origin-bottom [transform:perspective(600px)_rotateX(60deg)] [mask-image:linear-gradient(to_top,black,transparent_80%)]"
      />
      <div className="relative mx-auto w-full max-w-5xl px-5 py-28 sm:px-8 sm:py-36">
        <div className="scroll-scale text-center">
          <p className="text-xs tracking-[0.3em] text-primary uppercase">{CIERRE.eyebrow}</p>
          <h2 className="mt-5 text-5xl leading-[0.95] font-semibold tracking-[-0.04em] text-balance sm:text-7xl lg:text-8xl">
            <span className="text-fade">{CIERRE.tituloAntes}</span>{" "}
            <span className="text-shimmer">{CIERRE.tituloResaltado}</span>
          </h2>
          <p className="mt-6 font-mono text-sm text-white/50 sm:text-base">
            {evento.hasDate
              ? `${evento.dates} · ${evento.time} · ${evento.timezone}`
              : "Fecha por confirmar"}
          </p>
        </div>

        <div
          className={`mt-16 grid gap-5 ${evento.agenda.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-2xl"}`}
        >
          {evento.agenda.map((item, index) => (
            <Reveal key={`${item.badge}-${index}`} delay={index * 90} className="h-full">
              <div className="border-beam glass h-full rounded-3xl p-7 sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="text-xs tracking-[0.2em] text-primary uppercase">
                    {item.badge} · {item.day}
                  </p>
                </div>
                <h3 className="mt-6 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 text-center">
          <CtaLink className="px-10 py-5 text-base">{CIERRE.boton}</CtaLink>
          <p className="mt-6 text-xs text-white/40">{CIERRE.aviso}</p>
        </Reveal>

        <p className="mx-auto mt-20 max-w-3xl text-center text-xs leading-relaxed text-white/35">
          {AVISO_LEGAL}
        </p>
      </div>
    </section>
  );
}
