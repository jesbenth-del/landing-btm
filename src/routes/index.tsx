import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import btmLogo from "@/assets/btm-academy-logo.png";
import founderBtm from "@/assets/founder-btm.jpg";
import { SiteFooter } from "@/components/site-footer";
import { submitLead } from "@/lib/submit-lead";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, Check, ChevronDown, Menu, X } from "lucide-react";

export const FAQ_ITEMS = [
  {
    question: "¿Qué es la Sesión Cero BTM?",
    answer:
      "Es una sesión gratuita para conocer cómo interpretamos el mercado, qué diferencia nuestro enfoque y si BTM encaja contigo.",
  },
  {
    question: "¿La Sesión Cero es gratuita?",
    answer: "Sí. Es el primer acercamiento al enfoque BTM y no tiene coste.",
  },
  {
    question: "¿Necesito experiencia previa?",
    answer:
      "No es imprescindible. Tanto si estás empezando como si llevas tiempo estudiando, la sesión te ayudará a ordenar tu forma de analizar.",
  },
  {
    question: "¿Puedo asistir si ya conozco Smart Money, ICT o Price Action?",
    answer:
      "Sí. BTM no busca que acumules otra etiqueta, sino ayudarte a conectar lo que ya conoces dentro de una lectura completa del mercado.",
  },
  {
    question: "¿BTM trabaja con Forex, Oro e Índices?",
    answer: "Sí. La metodología se aplica a Forex, Oro (XAUUSD) e Índices.",
  },
  {
    question: "¿BTM da señales?",
    answer:
      "No. El objetivo no es crear dependencia de señales, sino enseñar una forma estructurada de interpretar el mercado.",
  },
  {
    question: "¿La Sesión Cero me obliga a comprar una mentoría?",
    answer:
      "No. Es el primer acercamiento al enfoque BTM. Después de conocerlo, tú decides si quieres profundizar.",
  },
  {
    question: "¿Cuál es la diferencia entre Sesión Cero y Mentoría?",
    answer:
      "La Sesión Cero es para conocer el enfoque. La Mentoría es un proceso personalizado y profundo para desarrollar y afianzar tu forma de analizar y operar.",
  },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BTM Academy — Entiende lo que realmente mueve el mercado" },
      {
        name: "description",
        content:
          "Aprende a conectar contexto, estructura y validación para interpretar Forex, Oro e Índices con mayor claridad.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
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
        <SessionZero />
        <Information />
        <Difference />
        <Philosophy />
        <Method />
        <Testimonials />
        <SessionBridge />
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

function Mark({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>;
}
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
      <span className="h-px w-6 bg-primary" />
      {children}
    </div>
  );
}
function CTA({
  children = "RESERVAR MI LUGAR",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      href="#formulario"
      className={`inline-flex items-center justify-center gap-3 rounded-md bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-primary-foreground transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {children}
      <ArrowRight className="size-4" />
    </a>
  );
}

const NAV_LINKS = [
  { href: "#problema", label: "El problema" },
  { href: "#metodologia", label: "Enfoque" },
  { href: "#programas", label: "Programas" },
  { href: "#faq", label: "FAQ" },
];
function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" aria-label="BTM Academy">
          <img
            src={btmLogo}
            alt="BTM Academy"
            className="h-8 w-auto sm:h-9"
            width={720}
            height={311}
          />
        </a>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a href="#formulario" className="font-semibold text-primary">
            Sesión Cero
          </a>
        </nav>
        <a
          href="#formulario"
          className="hidden items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground md:inline-flex"
        >
          Sesión Cero <ArrowRight className="size-3.5" />
        </a>
        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="text-foreground md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-5 border-t border-border bg-background px-6 py-6 md:hidden">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            href="#formulario"
            onClick={() => setOpen(false)}
            className="font-semibold text-primary"
          >
            Sesión Cero <ArrowRight className="ml-1 inline size-4" />
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border/60"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-36">
        <div>
          <SectionLabel>BTM Academy · Formación con criterio</SectionLabel>
          <h1 className="mt-7 max-w-3xl text-balance text-5xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-7xl">
            Entiende lo que <Mark>realmente</Mark> mueve el mercado.
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Deja de acumular conceptos aislados. Aprende a conectar contexto,
            estructura y validación para tomar decisiones con mayor claridad en
            Forex, Oro e Índices.
          </p>
          <div className="mt-9 border-l-2 border-primary pl-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Sesión Cero BTM
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Descubre cómo funciona nuestro enfoque para entender el mercado.
            </p>
          </div>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <CTA>Reservar mi lugar</CTA>
            <span className="text-xs text-muted-foreground">
              Sesión gratuita · Sin señales · Sin promesas de rentabilidad
            </span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <img
            src={founderBtm}
            alt="Fundador de BTM Academy analizando el mercado"
            className="aspect-[4/5] w-full object-cover object-center opacity-90"
            width={800}
            height={1000}
            loading="eager"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent px-6 pb-6 pt-24">
            <p className="text-sm font-medium">
              Una forma estructurada de interpretar el mercado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    "Has aprendido muchos conceptos pero no sabes cómo conectarlos.",
    "Cambias de metodología constantemente.",
    "Buscas entradas y operas demasiado en temporalidades bajas.",
    "Sientes que siempre necesitas otra confirmación.",
    "Te cuesta saber cuándo NO operar.",
    "Tienes información, pero no un proceso claro para analizar.",
  ];
  return (
    <section
      id="problema"
      className="border-b border-border/60 bg-card/20 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Quizás esto te resulte familiar</SectionLabel>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-5xl">
            El problema no es que no estés <Mark>estudiando.</Mark>
          </h2>
          <div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-border pt-7">
              <p className="text-lg font-medium">
                Si te identificaste con varios de estos puntos, probablemente no
                necesitas otra estrategia.
              </p>
              <p className="mt-2 text-xl font-semibold text-primary">
                Necesitas aprender a conectar lo que ya sabes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SessionZero() {
  const points = [
    "Contexto antes que entrada",
    "Estructura antes que señal",
    "Selectividad antes que sobreoperación",
    "Comprensión antes que dependencia",
  ];
  return (
    <section
      id="sesion-cero"
      className="border-b border-border/60 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 rounded-2xl border border-primary/40 bg-primary p-7 text-primary-foreground sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
              Sesión Cero BTM
            </p>
            <h2 className="mt-5 text-balance text-3xl font-medium tracking-tight sm:text-5xl">
              Antes de aprender más, entiende cómo vemos el mercado.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 opacity-80">
              Una sesión gratuita para traders cansados de acumular conceptos,
              cambiar de metodología y buscar entradas constantemente sin tener
              una estructura clara para interpretar el mercado.
            </p>
            <CTA className="mt-8 bg-background text-foreground">
              Quiero asistir a Sesión Cero
            </CTA>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {points.map((point, i) => (
              <div
                key={point}
                className="border border-primary-foreground/20 p-5"
              >
                <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                <h3 className="mt-5 text-sm font-bold">{point}</h3>
                <p className="mt-2 text-xs leading-5 opacity-70">
                  {
                    [
                      "Aprende por qué una operación no empieza buscando una entrada.",
                      "Conecta la información del mercado antes de decidir.",
                      "Descubre por qué no buscamos operar cada movimiento.",
                      "Aprende a interpretar sin depender de señales.",
                    ][i]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Information() {
  return (
    <section className="border-b border-border/60 bg-card/20 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionLabel>No necesitas más información</SectionLabel>
        <h2 className="mt-7 text-balance text-3xl font-medium tracking-tight sm:text-5xl">
          Probablemente ya has consumido suficiente información sobre trading.
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground">
          Diferentes personas te enseñaron conceptos aislados, muchas veces sin
          explicarte cómo conectarlos dentro de una lectura completa del
          mercado.
        </p>
        <p className="mx-auto mt-8 max-w-2xl text-xl font-medium leading-8">
          <Mark>BTM parte de una idea diferente:</Mark> no se trata de aprender
          más conceptos. Se trata de entender cuáles importan, cómo se
          relacionan y cuándo realmente tienen sentido.
        </p>
      </div>
    </section>
  );
}

function Difference() {
  const normal = [
    "Más conceptos",
    "Más indicadores o herramientas",
    "Más señales y confirmaciones",
    "Más operaciones",
    "Cambiar de metodología",
  ];
  const btm = [
    "Contexto",
    "Estructura",
    "Validación",
    "Selección",
    "Paciencia y gestión",
  ];
  return (
    <section className="border-b border-border/60 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Por qué BTM Academy es diferente</SectionLabel>
        <h2 className="mt-7 max-w-3xl text-balance text-3xl font-medium tracking-tight sm:text-5xl">
          No somos otra metodología. Somos una forma estructurada de{" "}
          <Mark>interpretar el mercado.</Mark>
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          <div className="bg-card p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Lo que normalmente ocurre
            </p>
            <ul className="mt-7 grid gap-4">
              {normal.map((x) => (
                <li
                  key={x}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="text-muted-foreground">—</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-primary p-7 text-primary-foreground sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-70">
              El enfoque BTM
            </p>
            <ul className="mt-7 grid gap-4">
              {btm.map((x) => (
                <li
                  key={x}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <Check className="size-4" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 max-w-2xl text-xl font-medium leading-8 sm:text-2xl">
          No enseñamos a buscar más entradas. Enseñamos a entender{" "}
          <Mark>cuándo una entrada tiene sentido.</Mark>
        </p>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="border-b border-border/60 bg-card/20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <SectionLabel>Filosofía BTM</SectionLabel>
          <h2 className="mt-7 text-balance text-3xl font-medium tracking-tight sm:text-5xl">
            Cuando entiendes el contexto, las entradas dejan de ser una{" "}
            <Mark>adivinanza.</Mark>
          </h2>
          <p className="mt-7 text-lg leading-8 text-muted-foreground">
            En BTM no empezamos preguntando “¿dónde entro?”. Primero preguntamos
            “¿qué está haciendo el mercado?”.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-3 text-lg font-medium sm:gap-5 sm:text-2xl">
          {["Contexto", "Estructura", "Validación", "Ejecución"].map((x, i) => (
            <span key={x} className="flex items-center gap-3">
              <span className="border border-primary px-4 py-3">{x}</span>
              {i < 3 && <ArrowRight className="size-5 text-primary" />}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method() {
  const steps = [
    [
      "Entender",
      "Aprender a interpretar el contexto antes de pensar en una entrada.",
    ],
    [
      "Conectar",
      "Dejar de estudiar conceptos aislados y aprender cómo se relacionan.",
    ],
    [
      "Validar",
      "Diferenciar una zona interesante de una oportunidad realmente válida.",
    ],
    [
      "Ejecutar",
      "Tomar decisiones con un proceso definido sin perseguir el mercado.",
    ],
  ];
  return (
    <section
      id="metodologia"
      className="border-b border-border/60 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Cómo enseñamos</SectionLabel>
            <h2 className="mt-7 text-balance text-3xl font-medium tracking-tight sm:text-5xl">
              Una forma distinta de <Mark>pensar.</Mark>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            No queremos darte una lista interminable de conocimientos. Queremos
            que puedas tomar mejores decisiones con un proceso claro.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <div key={title} className="bg-card p-6 sm:p-7">
              <span className="font-mono text-sm text-primary">0{i + 1}</span>
              <h3 className="mt-12 text-lg font-semibold uppercase tracking-wide">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "Ahora puedo ver el mercado con mucha más claridad y dejar de saltar entre conceptos.",
      name: "Alumno BTM",
    },
    {
      quote:
        "La diferencia está en entender cómo conectar la información, no en añadir otra estrategia.",
      name: "Alumno BTM",
    },
    {
      quote:
        "Aprendí a esperar y a tener un proceso antes de pensar en ejecutar.",
      name: "Alumno BTM",
    },
  ];
  return (
    <section className="border-b border-border/60 bg-card/20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Lo que dicen nuestros estudiantes</SectionLabel>
        <h2 className="mt-7 text-balance text-3xl font-medium tracking-tight sm:text-5xl">
          Más claridad. Menos <Mark>ruido.</Mark>
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.quote}
              className="rounded-xl border border-border bg-card p-6"
            >
              <blockquote className="text-base leading-7">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function SessionBridge() {
  return (
    <section className="border-b border-border/60 py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-6 sm:flex-row sm:items-center">
        <div>
          <SectionLabel>Primer paso</SectionLabel>
          <h2 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
            ¿Quieres conocer el enfoque BTM?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Da el primer paso antes de decidir si BTM es para ti.
          </p>
        </div>
        <CTA>Reservar mi lugar en Sesión Cero</CTA>
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section
      id="programas"
      className="border-b border-border/60 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Programas</SectionLabel>
        <h2 className="mt-7 text-3xl font-medium tracking-tight sm:text-5xl">
          Empieza <Mark>aquí.</Mark>
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <ProgramCard
            primary
            tag="Sesión Cero BTM"
            title="Conoce primero nuestro enfoque."
            description="Una sesión gratuita para entender cómo interpretamos el mercado, qué diferencia nuestro enfoque y si BTM encaja contigo."
            bullets={[
              "Sesión gratuita",
              "Contexto, estructura y validación",
              "Sin señales ni promesas",
            ]}
          />
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                ¿Quieres llevarlo más lejos?
              </p>
              <h3 className="mt-6 text-2xl font-medium">
                Mentoría personalizada.
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Trabaja directamente conmigo para desarrollar y afianzar tu
                forma de analizar y operar.
              </p>
            </div>
            <a
              href="#formulario"
              className="mt-9 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-primary"
            >
              Aplicar a mentoría <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
function ProgramCard({
  primary,
  tag,
  title,
  description,
  bullets,
}: {
  primary?: boolean;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div
      className={`rounded-2xl border p-7 sm:p-9 ${primary ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-70">
        {tag}
      </p>
      <h3 className="mt-6 text-3xl font-medium tracking-tight">{title}</h3>
      <p className="mt-4 max-w-xl text-sm leading-6 opacity-80">
        {description}
      </p>
      <ul className="mt-8 grid gap-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-3 text-sm">
            <Check className="size-4" />
            {bullet}
          </li>
        ))}
      </ul>
      <CTA className={`mt-9 ${primary ? "bg-background text-foreground" : ""}`}>
        Reservar Sesión Cero
      </CTA>
    </div>
  );
}

function LeadForm() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    whatsapp: "",
    studyTime: "",
    struggle: "",
    privacy: false,
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [utm, setUtm] = useState<Record<string, string>>({});
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
    });
  }, []);
  const update = (key: keyof typeof fields, value: string | boolean) =>
    setFields((prev) => ({ ...prev, [key]: value }));
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fields.privacy) return;
    setStatus("loading");
    try {
      await submitLead({
        data: {
          name: fields.name,
          email: fields.email,
          whatsapp: fields.whatsapp,
          studyTime: fields.studyTime,
          struggle: fields.struggle,
          interest: "sesion_cero",
          privacyAccepted: true,
          privacyPolicyVersion: "2026-01",
          privacyAcceptedAt: new Date().toISOString(),
          source: "form",
          sourcePage: window.location.href,
          ...utm,
        },
      });
      trackEvent("generate_lead", {
        interest: "sesion_cero",
        study_time: fields.studyTime,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }
  return (
    <section
      id="formulario"
      className="border-b border-border/60 bg-card/20 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <SectionLabel>Sesión Cero BTM</SectionLabel>
          <h2 className="mt-7 text-balance text-3xl font-medium tracking-tight sm:text-5xl">
            Reserva tu lugar en <Mark>Sesión Cero BTM.</Mark>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
            Cuéntanos brevemente en qué punto estás para entender mejor quién
            está entrando a BTM.
          </p>
        </div>
        {status === "success" ? (
          <div className="mt-10 rounded-2xl border border-primary/40 bg-card p-10 text-center">
            <Check className="mx-auto size-10 text-primary" />
            <h3 className="mt-5 text-2xl font-medium">
              Hemos recibido tus datos.
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Te contactaremos con la información de la próxima Sesión Cero.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre">
                <input
                  required
                  value={fields.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  value={fields.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field label="WhatsApp">
                <input
                  required
                  value={fields.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                />
              </Field>
              <Field label="Tiempo operando">
                <select
                  required
                  value={fields.studyTime}
                  onChange={(e) => update("studyTime", e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  <option>Estoy empezando</option>
                  <option>Menos de 1 año</option>
                  <option>1–3 años</option>
                  <option>Más de 3 años</option>
                </select>
              </Field>
            </div>
            <Field label="¿Qué es lo que más te cuesta actualmente?">
              <select
                required
                value={fields.struggle}
                onChange={(e) => update("struggle", e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                <option>No sé cómo analizar el mercado.</option>
                <option>
                  Tengo demasiados conceptos y no sé cómo conectarlos.
                </option>
                <option>Cambio constantemente de metodología.</option>
                <option>Entro demasiado y me cuesta esperar.</option>
                <option>Me cuesta interpretar el contexto.</option>
                <option>Tengo otros problemas.</option>
              </select>
            </Field>
            <label className="mt-6 flex items-start gap-3 text-xs leading-5 text-muted-foreground">
              <input
                type="checkbox"
                checked={fields.privacy}
                onChange={(e) => update("privacy", e.target.checked)}
                className="mt-1 size-4 accent-primary"
                required
              />
              Acepto la{" "}
              <a
                href="/politica-de-privacidad"
                className="text-primary underline"
              >
                política de privacidad
              </a>{" "}
              y el tratamiento de mis datos.
            </label>
            {status === "error" && (
              <p className="mt-4 text-sm text-destructive">
                No se pudo enviar. Inténtalo de nuevo.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-md bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-primary-foreground disabled:opacity-60"
            >
              {status === "loading" ? "Enviando…" : "Reservar mi lugar"}
              <ArrowRight className="size-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

function FAQ() {
  return (
    <section id="faq" className="border-b border-border/60 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionLabel>Preguntas frecuentes</SectionLabel>
        <h2 className="mt-7 text-3xl font-medium tracking-tight sm:text-5xl">
          Resolvemos tus <Mark>dudas.</Mark>
        </h2>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium marker:content-none">
                {item.question}
                <ChevronDown className="size-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
              </summary>
              <p className="max-w-2xl pt-4 text-sm leading-6 text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
function Closing() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionLabel>El siguiente paso</SectionLabel>
        <h2 className="mt-7 text-balance text-4xl font-medium tracking-tight sm:text-6xl">
          No necesitas más conceptos.
          <br />
          <Mark>Necesitas aprender a conectarlos.</Mark>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-sm leading-6 text-muted-foreground">
          Conoce el enfoque BTM en la Sesión Cero y descubre una forma diferente
          de interpretar el mercado.
        </p>
        <CTA className="mt-9">Reservar mi lugar</CTA>
      </div>
    </section>
  );
}
function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <a
        href="#formulario"
        className="flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground"
      >
        Sesión Cero <ArrowRight className="size-4" />
      </a>
    </div>
  );
}
