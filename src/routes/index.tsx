import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import btmLogo from "@/assets/btm-academy-logo.png";
import founderBtm from "@/assets/founder-btm.jpg";
import { SiteFooter } from "@/components/site-footer";
import { submitLead } from "@/lib/submit-lead";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowRight,
  Check,
  LineChart,
  Compass,
  Target,
  ShieldCheck,
  Quote,
  Sparkles,
  Minus,
  ChevronDown,
  Menu,
  X,
  ChevronLeft,
  BookOpen,
  Users,
} from "lucide-react";

export const FAQ_ITEMS = [
  {
    question: "¿Necesito experiencia previa en trading?",
    answer:
      "No es imprescindible, pero sí ayuda haber explorado el mercado antes. Lo importante es que quieras dejar de acumular conceptos sueltos y construir un marco estructurado para operar Forex, Oro e Índices con criterio.",
  },
  {
    question: "¿Qué diferencia hay entre el Workshop y la Mentoría?",
    answer:
      "El Workshop Especializado es una formación intensiva centrada en las 4 leyes estructurales para validar zonas de alta probabilidad. La Mentoría Personalizada es un acompañamiento 1:1 con diagnóstico individual, revisión continua de análisis y seguimiento de tu operativa.",
  },
  {
    question: "¿Dan señales de trading o prometen rentabilidad?",
    answer:
      "No. BTM Academy es una marca educativa. No vendemos señales ni garantizamos rentabilidades. Enseñamos a interpretar el mercado con estructura, contexto y validación para que desarrolles criterio propio.",
  },
  {
    question: "¿Qué mercados cubre la metodología?",
    answer:
      "La metodología se aplica a Forex, Oro (XAUUSD) e Índices. El enfoque es conectar estructura, contexto y validación en cualquiera de estos mercados, no depender de indicadores aislados ni de estrategias memorizadas.",
  },
  {
    question: "¿Cómo puedo aplicar o pedir más información?",
    answer:
      "Completa el formulario de contacto al final de esta página. Te responderemos con la opción que mejor encaje con tu momento actual: Workshop, Mentoría o ambos.",
  },
] as const;

function buildFaqStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BTM Academy — Entiende lo que mueve el mercado" },
      {
        name: "description",
        content:
          "Formación premium en Forex, Oro e Índices. Conecta estructura, contexto y validación para operar con criterio.",
      },
      { property: "og:title", content: "BTM Academy — Entiende lo que mueve el mercado" },
      {
        property: "og:description",
        content: "Una metodología clara para operar Forex, Oro e Índices con criterio.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildFaqStructuredData()),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <ContextMessage />
        <SessionZero />
        <Philosophy />
        <Difference />
        <Method />
        <Testimonials />
        <StatementBreak />
        <Programs />
        <LeadForm />
        <FAQ />
        <Closing />
      </main>
      <MobileStickyBar />
      <SiteFooter />
    </div>
  );
}

/* ---------- Reusable bits ---------- */

function Mark({ children }: { children: React.ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
      <span className="h-px w-6 bg-primary" />
      {children}
    </div>
  );
}

/* ---------- Nav ---------- */

const NAV_LINKS = [
  { href: "#problema", label: "El problema" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#programas", label: "Programas" },
  { href: "#faq", label: "FAQ" },
  { href: "#formulario", label: "Contacto" },
] as const;

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" aria-label="BTM Academy" className="flex items-center">
          <img
            src={btmLogo}
            alt="BTM Academy — formación en trading Forex, Oro e Índices"
            className="h-8 w-auto sm:h-9"
            width={720}
            height={311}
            loading="eager"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#formulario"
          className="hidden items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
        >
          Aplicar <ArrowRight className="h-3.5 w-3.5" />
        </a>

        {/* Mobile: hamburger toggle */}
        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-md text-foreground transition-colors hover:bg-secondary md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border/60 bg-background/95 px-6 pb-6 md:hidden">
          <nav className="mt-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#formulario"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Aplicar ahora <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border/60">
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.22 0 0) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.22 0 0) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 pt-16 pb-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-20 lg:pb-24">
        <div>
          <SectionLabel>Forex · Oro · Índices</SectionLabel>
          <h1 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Entiende lo que <Mark>realmente</Mark> mueve el mercado.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Deja de acumular conceptos aislados. Aprende a conectar contexto, estructura y validación para entender el mercado con mayor claridad en Forex, Oro e Índices.
          </p>
          <div className="mt-10">
            <a
              href="#formulario"
              data-hero-cta=""
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Reserva tu lugar en Sesión Cero
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-8 text-xs text-muted-foreground">
            <Stat label="Mercados" value="FX · XAU · Índices" />
            <Stat label="Enfoque" value="Estructura" />
            <Stat label="Sin" value="Señales / promesas" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 translate-x-5 translate-y-5 rounded-2xl border border-primary/15" />
          <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-2xl shadow-black/20">
            <div className="relative aspect-[3/4] w-full sm:aspect-[4/5]">
              <img
                src={founderBtm}
                alt="Fundador de BTM Academy explicando estructura de mercado en Forex y Oro"
                className="h-full w-full object-cover"
                width={1080}
                height={1350}
                loading="eager"
                fetchPriority="high"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-background/10 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-black/10" />
            </div>
          </div>
          <div className="absolute -bottom-4 left-4 right-4 flex flex-col gap-2.5 rounded-xl border border-border/60 bg-card/95 px-5 py-4 text-xs backdrop-blur sm:left-6 sm:right-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-4 sm:py-3">
            <span className="inline-flex items-center gap-1.5 text-primary font-medium text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Jesus Bentham
            </span>
            <span className="text-muted-foreground">Fundador</span>
            <span className="text-muted-foreground">BTM Academy</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-primary">{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

/* ---------- Problem ---------- */

function Problem() {
  const items = [
    "Tienes muchos conceptos, pero no sabes cómo conectarlos.",
    "Cada vez que algo no funciona, terminas buscando otra metodología.",
    "Sabes identificar zonas, patrones y estructuras, pero no sabes cuándo realmente tienen sentido.",
    "Bajas demasiado rápido a temporalidades pequeñas buscando una entrada.",
    "El exceso de información te ha dado más dudas que claridad.",
    "Terminas operando movimientos que ni siquiera necesitabas operar.",
  ];
  return (
    <section id="problema" className="border-b border-border/30 sm:border-border/60 bg-card/20 py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>El punto de partida</SectionLabel>
        <h2 className="mt-6 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
          Quizás esto te resulta <Mark>familiar.</Mark>
        </h2>
        <div className="mt-8 sm:mt-14 grid gap-4 sm:grid-cols-2">
          {items.map((t) => (
            <div
              key={t}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/5 text-primary">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Context message ---------- */

function ContextMessage() {
  return (
    <section className="border-b border-border/30 sm:border-border/60 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-balance text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl">
          El problema probablemente no es que necesites <Mark>aprender más.</Mark>
          <br className="hidden sm:block" /> Es que nadie te enseñó a conectar <Mark>lo que ya sabes.</Mark>
        </p>
      </div>
    </section>
  );
}

/* ---------- Philosophy ---------- */

function Philosophy() {
  return (
    <section className="border-b border-border/30 sm:border-border/60 py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionLabel>Filosofía</SectionLabel>
            <h2 className="mt-6 text-balance text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
              No necesitas más <Mark>información.</Mark>
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                La mayoría de traders no fracasa por falta de contenido. Fracasa porque aprende
                conceptos aislados sin entender cómo funcionan juntos.
              </p>
              <p className="text-foreground/90">
                En BTM Academy enseñamos a conectar esas piezas dentro de una estructura lógica y
                repetible.
              </p>
            </div>
            <blockquote className="mt-10 border-l-2 border-primary pl-5 text-lg font-medium tracking-tight">
              "No te falta información. Te falta un mapa."
            </blockquote>
          </div>

          <FlowDiagram />
        </div>
      </div>
    </section>
  );
}

function FlowDiagram() {
  const stages = [
    { label: "Caos", desc: "Conceptos sueltos, ruido, sesgo." },
    { label: "Estructura", desc: "Marco lógico y repetible." },
    { label: "Claridad", desc: "Decisiones con criterio." },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-4">
        {stages.map((s, i) => (
          <div key={s.label} className="relative">
            <div className="flex items-center gap-4 rounded-xl border border-border bg-background/50 p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary text-xs font-mono text-muted-foreground">
                0{i + 1}
              </span>
              <div className="min-w-0">
                <div
                  className={`text-base font-medium tracking-tight ${
                    i === stages.length - 1 ? "text-primary" : "text-foreground"
                  }`}
                >
                  {s.label}
                </div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </div>
            </div>
            {i < stages.length - 1 && (
              <div className="ml-[34px] my-1 h-5 w-px bg-gradient-to-b from-border to-primary/40" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Method ---------- */

/* ---------- Difference (Why BTM is different) ---------- */

function Difference() {
  const negative = [
    "Aprendes conceptos por separado.",
    "Saltas de una estrategia a otra.",
    "Memorizas nombres sin entender el contexto.",
    "Dependes de indicadores o señales.",
    "Terminas con más información pero menos claridad.",
  ];
  const positive = [
    "Aprendes a conectar todas las piezas.",
    "Entiendes el contexto antes de buscar entradas.",
    "Desarrollas criterio propio.",
    "Tomas decisiones con lógica estructurada.",
    "Construyes una metodología que puedes repetir.",
  ];
  return (
    <section className="border-b border-border/30 sm:border-border/60 py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Diferencia</SectionLabel>
        <h2 className="mt-6 max-w-3xl text-balance text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
          ¿Por qué BTM Academy es <Mark>diferente?</Mark>
        </h2>
        <div className="mt-6 max-w-3xl space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>El problema no es que existan pocos cursos de trading.</p>
          <p>El problema es que la mayoría enseña conceptos aislados.</p>
          <p className="text-foreground/90">
            Nosotros enseñamos cómo conectar todas las piezas para interpretar el mercado con
            criterio.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-5 lg:grid-cols-2">
          {/* Columna izquierda: gris oscuro */}
          <div className="flex flex-col rounded-2xl border border-border bg-card/40 p-6 sm:p-8 md:p-10">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Comparación
            </div>
            <h3 className="mt-3 text-xl font-medium tracking-tight text-muted-foreground sm:text-2xl">
              Lo que normalmente ocurre
            </h3>
            <ul className="mt-8 space-y-4">
              {negative.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-border bg-secondary text-muted-foreground">
                    <Minus className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna derecha: acento */}
          <div className="relative flex flex-col rounded-2xl border border-primary/40 bg-card p-6 sm:p-8 md:p-10">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/[0.04]" />
            <div className="text-xs font-mono uppercase tracking-widest text-primary">
              BTM Academy
            </div>
            <h3 className="mt-3 text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              El enfoque de BTM Academy
            </h3>
            <ul className="mt-8 space-y-4">
              {positive.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-14 border-t border-border/60 pt-8 sm:pt-12 text-center">
          <p className="mx-auto max-w-3xl text-balance text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-4xl">
            Cuando entiendes el <Mark>contexto,</Mark>
            <br className="hidden sm:block" /> las entradas dejan de ser una{" "}
            <Mark>adivinanza.</Mark>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Method ---------- */

function Method() {
  const steps = [
    {
      icon: LineChart,
      title: "Comprender la estructura del mercado.",
      desc: "Identifica el esqueleto del precio antes de mirar cualquier indicador.",
    },
    {
      icon: Compass,
      title: "Interpretar correctamente el contexto.",
      desc: "Lee el momento del mercado para no operar contra la narrativa dominante.",
    },
    {
      icon: Target,
      title: "Validar zonas de alta probabilidad.",
      desc: "Aplica filtros estructurales para confirmar dónde merece la pena operar.",
    },
    {
      icon: ShieldCheck,
      title: "Tomar decisiones con criterio.",
      desc: "Ejecuta con un proceso definido, no con impulsos ni sesgos.",
    },
  ];
  return (
    <section id="metodologia" className="border-b border-border/30 sm:border-border/60 bg-card/20 py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Metodología</SectionLabel>
            <h2 className="mt-6 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
              Cómo <Mark>enseñamos.</Mark>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Un sistema de cuatro pasos para pasar de acumular conceptos a operar con un marco claro
            y repetible.
          </p>
        </div>

        {/* Desktop: horizontal flow with connectors */}
        <div className="mt-10 hidden sm:grid sm:grid-cols-4 sm:gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              {i < steps.length - 1 && (
                <ArrowRight className="absolute top-[18px] right-[-14px] z-10 h-4 w-4 text-border" />
              )}
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-primary">
                <s.icon className="h-4 w-4" />
              </div>
              <span className="font-mono text-xs tracking-widest text-muted-foreground">
                PASO {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-2 text-base font-medium leading-snug tracking-tight text-foreground">
                {s.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile: vertical connected list */}
        <div className="mt-8 flex flex-col sm:hidden">
          {steps.map((s, i) => (
            <div key={s.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
                {i < steps.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-linear-to-b from-border to-border/20" />
                )}
              </div>
              <div className="min-w-0 pb-6">
                <span className="font-mono text-xs tracking-widest text-muted-foreground">
                  PASO {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-1 text-base font-medium tracking-tight text-foreground">
                  {s.title}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

function Testimonials() {
  const items = [
    {
      quote:
        "Después de años saltando entre mentores, por fin tengo una forma estructurada de leer el mercado.",
      name: "Andrés M.",
      role: "Trader retail · 2 años",
      // TODO(cliente): agregar foto real: avatarSrc: "/testimonials/andres.jpg"
      avatarSrc: undefined as string | undefined,
    },
    {
      quote:
        "Lo que enseñan no es más contenido, es un marco. Mi análisis dejó de cambiar cada semana.",
      name: "Daniela R.",
      role: "Estudiante de mentoría",
      avatarSrc: undefined as string | undefined,
    },
    {
      quote:
        "Sin promesas, sin humo. Es la primera academia que sentí seria desde el primer contacto.",
      name: "Luis P.",
      role: "Workshop · XAUUSD",
      avatarSrc: undefined as string | undefined,
    },
  ];
  return (
    <section className="border-b border-border/30 sm:border-border/60 py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Estudiantes</SectionLabel>
        <h2 className="mt-6 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
          Lo que dicen nuestros <Mark>estudiantes.</Mark>
        </h2>

        <div className="mt-10">
          {/* <TrustStats /> */}

          <div className="grid gap-4 md:grid-cols-3">
            {items.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8"
              >
                <Quote className="h-5 w-5 text-primary" />
                <blockquote className="mt-4 grow text-base leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                  {t.avatarSrc ? (
                    <img
                      src={t.avatarSrc}
                      alt={t.name}
                      className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-secondary text-xs font-semibold text-muted-foreground">
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStats() {
  // TODO(cliente): reemplazar los placeholders con cifras reales antes de publicar.
  const stats = [
    { value: "[Completar]", label: "alumnos formados" },
    { value: "[Completar]", label: "países" },
    { value: "[Completar]", label: "cohortes realizadas" },
  ];
  return (
    <div className="mb-10 grid grid-cols-3 overflow-hidden rounded-xl border border-border">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`py-5 px-3 text-center ${i < stats.length - 1 ? "border-r border-border" : ""}`}
        >
          <div className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {s.value}
          </div>
          <div className="mt-1 text-[11px] leading-tight text-muted-foreground sm:text-xs">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Programs ---------- */

function getNextSaturdayLabel(): string {
  const today = new Date();
  const day = today.getDay();
  const daysUntilSaturday = day === 6 ? 7 : (6 - day + 7) % 7;
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);

  const formatted = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(nextSaturday);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function SessionZero() {
  return (
    <section className="border-b border-border/30 sm:border-border/60 py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <ProgramCard
          tag="Sesión gratuita en vivo"
          title="Sesión Cero BTM"
          description="Las 4 leyes estructurales para validar zonas de alta probabilidad."
          bullets={[
            "Identifica el error que mantiene estancados a la mayoría de los traders.",
            "Aprende a identificar el contexto antes de operar.",
            "Entiende el mercado sin depender de indicadores ni señales.",
          ]}
          cta="Reservar mi cupo gratuito"
          highlight={false}
          availability={`Próxima sesión: ${getNextSaturdayLabel()}`}
        />
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section id="programas" className="border-b border-border/30 sm:border-border/60 py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Programas</SectionLabel>
        <h2 className="mt-6 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
          Opciones para aprender <Mark>con nosotros.</Mark>
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ProgramCard
            tag="Acompañamiento 1:1"
            title="Mentoría Personalizada"
            description="Programa de acompañamiento para traders que buscan claridad, estructura y seguimiento."
            bullets={[
              "Diagnóstico y plan de trabajo individual.",
              "Revisión continua de análisis y decisiones.",
              "Estructura, contexto y validación aplicados a tu operativa.",
            ]}
            cta="Aplicar a la Mentoría"
            highlight
            availability="Cupos limitados"
          />
        </div>
      </div>
    </section>
  );
}

function ProgramCard({
  tag,
  title,
  description,
  bullets,
  cta,
  highlight,
  availability,
}: {
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  highlight: boolean;
  availability?: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 sm:p-10 ${
        highlight ? "border-primary/40 bg-card" : "border-border bg-card"
      }`}
    >
      {highlight && (
        <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" /> 1:1
        </span>
      )}
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{tag}</div>
      <h3 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">{title}</h3>
      {/* TODO(cliente): confirmar fecha y cupos reales antes de publicar */}
      {availability && (
        <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {availability}
        </div>
      )}
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
      <ul className="mt-6 space-y-3 border-t border-border/60 pt-6">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm text-foreground/90">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <a
        href="#formulario"
        className={`mt-8 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
          highlight
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-secondary text-foreground"
        }`}
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

/* ---------- FAQ ---------- */

function FAQ() {
  return (
    <section id="faq" className="border-b border-border/30 sm:border-border/60 py-10 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <SectionLabel>Preguntas frecuentes</SectionLabel>
        <h2 className="mt-6 text-balance text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
          Resolvemos tus <Mark>dudas.</Mark>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          Respuestas claras sobre mentoría de trading, nuestros programas y cómo aprender a operar
          Forex, Oro e Índices con criterio.
        </p>

        <div className="mt-10 divide-y divide-border/60 rounded-2xl border border-border bg-card">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group px-6 py-5 sm:px-8">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium tracking-tight text-foreground marker:content-none">
                {item.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Lead Form ---------- */

function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;

  const [fields, setFields] = useState({
    name: "",
    email: "",
    whatsapp: "",
    time: "",
    interest: "",
    struggle: "",
  });

  function setField(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep1(): string | null {
    if (!fields.name.trim()) return "Por favor ingresa tu nombre.";
    if (!fields.email.trim() || !/\S+@\S+\.\S+/.test(fields.email))
      return "Ingresa un correo electrónico válido.";
    if (!fields.whatsapp.trim()) return "Por favor ingresa tu WhatsApp.";
    return null;
  }

  function handleNext() {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setError(err);
        return;
      }
    }
    setError(null);
    setStep((s) => s + 1);
  }

  function handleBack() {
    setError(null);
    setStep((s) => s - 1);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!privacyAccepted) {
      setError("Debes aceptar la Política de Privacidad para enviar el formulario.");
      return;
    }

    setIsSubmitting(true);
    const params = new URLSearchParams(window.location.search);

    try {
      await submitLead({
        data: {
          name: fields.name,
          email: fields.email,
          whatsapp: fields.whatsapp,
          studyTime: fields.time || undefined,
          struggle: fields.struggle || undefined,
          interest: fields.interest || undefined,
          privacyAccepted: true,
          privacyPolicyVersion: "2026-07-02",
          privacyAcceptedAt: new Date().toISOString(),
          sourcePage: window.location.href,
          utm_source: params.get("utm_source") ?? undefined,
          utm_medium: params.get("utm_medium") ?? undefined,
          utm_campaign: params.get("utm_campaign") ?? undefined,
        },
      });
      trackEvent("generate_lead", {
        interest: fields.interest || undefined,
        study_time: fields.time || undefined,
      });
      setSubmitted(true);
    } catch {
      setError("No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="formulario" className="border-b border-border/30 sm:border-border/60 bg-card/20 py-10 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <SectionLabel>Contacto</SectionLabel>
        <h2 className="mt-6 text-balance text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
          Cuéntanos en qué <Mark>punto estás.</Mark>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          Responderemos con la opción que mejor encaja con tu momento actual.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-primary/30 bg-card p-8 text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-5 w-5" strokeWidth={3} />
            </div>
            <h3 className="mt-4 text-lg font-medium">Hemos recibido tu mensaje.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Te contactaremos en breve para darte claridad sobre los próximos pasos.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            {/* Step indicator */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Paso {step} de {TOTAL_STEPS}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {step === 1 ? "Tus datos" : step === 2 ? "Tu perfil" : "Tu situación"}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: contact info */}
            {step === 1 && (
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Nombre"
                    name="name"
                    placeholder="Tu nombre"
                    value={fields.name}
                    onChange={(v) => setField("name", v)}
                  />
                  <Field
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={fields.email}
                    onChange={(v) => setField("email", v)}
                  />
                </div>
                <Field
                  label="WhatsApp"
                  name="whatsapp"
                  placeholder="+57 310 000 000"
                  value={fields.whatsapp}
                  onChange={(v) => setField("whatsapp", v)}
                />
              </div>
            )}

            {/* Step 2: trading profile */}
            {step === 2 && (
              <div className="grid gap-5">
                <FieldGroup label="¿Cuánto tiempo llevas estudiando trading?">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {["Menos de 3 meses", "Entre 3 y 12 meses", "Más de 1 año"].map((o) => (
                      <Radio
                        key={o}
                        name="time"
                        value={o}
                        label={o}
                        checked={fields.time === o}
                        onChange={() => setField("time", o)}
                      />
                    ))}
                  </div>
                </FieldGroup>
                <FieldGroup label="¿Qué te interesa?">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {["Workshop", "Mentoría", "Ambos"].map((o) => (
                      <Radio
                        key={o}
                        name="interest"
                        value={o}
                        label={o}
                        checked={fields.interest === o}
                        onChange={() => setField("interest", o)}
                      />
                    ))}
                  </div>
                </FieldGroup>
              </div>
            )}

            {/* Step 3: situation + privacy + submit */}
            {step === 3 && (
              <div className="grid gap-5">
                <FieldGroup label="¿Qué es lo que más te cuesta actualmente?">
                  <textarea
                    name="struggle"
                    rows={4}
                    placeholder="Cuéntanos brevemente dónde te bloqueas..."
                    value={fields.struggle}
                    onChange={(e) => setField("struggle", e.target.value)}
                    className="w-full resize-none rounded-md border border-border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  />
                </FieldGroup>

                <div className="rounded-md border border-border/60 bg-background/50 px-4 py-3">
                  <label htmlFor="privacy-accept" className="flex cursor-pointer items-start gap-3">
                    <input
                      id="privacy-accept"
                      name="privacy-accept"
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    />
                    <span className="text-xs leading-relaxed text-foreground/90 sm:text-sm">
                      He leído y acepto la{" "}
                      <Link
                        to="/politica-de-privacidad"
                        className="text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
                      >
                        Política de Privacidad
                      </Link>
                      , y autorizo el tratamiento de mis datos personales para que BTM Academy me
                      contacte y me envíe información sobre sus programas.
                    </span>
                  </label>
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  >
                    {error}
                  </p>
                ) : null}
              </div>
            )}

            {/* Step error (steps 1 and 2) */}
            {error && step !== 3 ? (
              <p
                role="alert"
                className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}

            {/* Navigation */}
            <div className="mt-6 flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" /> Atrás
                </button>
              )}
              <div className="flex-1" />
              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Siguiente <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Enviando..." : "Enviar mi aplicación"}
                  {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              )}
            </div>

            <p className="mt-6 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Tus datos serán utilizados por BTM Academy para contactarte, responder tu solicitud y
              enviarte información relacionada con sus programas educativos. Podrás solicitar
              acceso, actualización, corrección o eliminación de tus datos a través del canal de
              contacto indicado en la{" "}
              <Link
                to="/politica-de-privacidad"
                className="text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
              >
                Política de Privacidad
              </Link>
              .
            </p>
          </form>
        )}

        <div className="mt-6 rounded-xl border border-border/60 bg-card/40 px-4 py-4">
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            BTM Academy ofrece formación educativa. El contenido de esta página no constituye
            asesoría financiera, recomendación de inversión, señales de trading ni promesa de
            rentabilidad. Operar en mercados financieros implica riesgos y cada persona es
            responsable de sus propias decisiones.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full rounded-md border border-border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function Radio({
  name,
  value,
  label,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 rounded-md border border-border bg-background px-3.5 py-3 text-sm transition-colors hover:border-primary/40 has-checked:border-primary has-checked:bg-primary/5">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange ? () => onChange() : undefined}
        className="peer sr-only"
      />
      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-border peer-checked:border-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-transparent peer-checked:bg-primary group-has-checked:bg-primary" />
      </span>
      <span className="text-foreground/90">{label}</span>
    </label>
  );
}

/* ---------- Statement Break ---------- */

function StatementBreak() {
  return (
    <div className="border-b border-border/30 sm:border-border/60 bg-card/20 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-balance text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-4xl">
          La diferencia entre un trader que opera con <Mark>miedo</Mark> y uno que opera con{" "}
          <Mark>criterio</Mark> es el marco que usa para leer el mercado.
        </p>
      </div>
    </div>
  );
}

/* ---------- Lead Magnet ---------- */

function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setError(null);
    const params = new URLSearchParams(window.location.search);
    try {
      await submitLead({
        data: {
          email,
          name: "",
          whatsapp: "",
          source: "lead_magnet",
          privacyAccepted: true,
          privacyPolicyVersion: "2026-07-02",
          privacyAcceptedAt: new Date().toISOString(),
          sourcePage: window.location.href,
          utm_source: params.get("utm_source") ?? undefined,
          utm_medium: params.get("utm_medium") ?? undefined,
          utm_campaign: params.get("utm_campaign") ?? undefined,
        },
      });
      trackEvent("lead_magnet_signup", { source: "lead_magnet" });
      setSubmitted(true);
    } catch {
      setError("No pudimos procesar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border-b border-border/30 sm:border-border/60 bg-card/20 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-2xl border border-primary/20 bg-card p-7 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-widest text-primary">
                Recurso gratuito
              </div>
              <h2 className="mt-1 text-xl font-medium tracking-tight sm:text-2xl">
                Las 4 leyes estructurales del mercado
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Descarga el documento base de la metodología BTM. Entiende los fundamentos antes de
                aplicar.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
              <span>
                Revisa tu correo.{" "}
                {/* TODO(cliente): reemplazar href con URL real del PDF antes de publicar */}
                <a href="#" className="text-primary underline underline-offset-2">
                  Descarga directa aquí
                </a>{" "}
                mientras tanto.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
                className="flex-1 rounded-md border border-border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:shrink-0"
              >
                {isSubmitting ? "Enviando..." : "Descargar gratis"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
              {error ? (
                <p className="text-sm text-destructive sm:col-span-2">{error}</p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Mobile Sticky CTA ---------- */

function MobileStickyBar() {
  const [showBar, setShowBar] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const heroCta = document.querySelector("[data-hero-cta]");
    const formSection = document.getElementById("formulario");

    const heroObs = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting));
    const formObs = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), {
      threshold: 0.1,
    });

    if (heroCta) heroObs.observe(heroCta);
    if (formSection) formObs.observe(formSection);

    return () => {
      heroObs.disconnect();
      formObs.disconnect();
    };
  }, []);

  if (!showBar || formInView) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden">
      <a
        href="#formulario"
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Aplicar ahora <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

/* ---------- Closing ---------- */

function Closing() {
  return (
    <section className="relative overflow-hidden border-b border-border/30 sm:border-border/60 py-14 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.22 0 0) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.22 0 0) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-balance text-3xl font-medium leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          No necesitas más conceptos.
          <br />
          <span className="text-muted-foreground">
            Necesitas una forma <Mark>clara</Mark> de entender el mercado.
          </span>
        </h2>
        <div className="mt-8 sm:mt-12 flex justify-center">
          <a
            href="#formulario"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Aplicar ahora <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
