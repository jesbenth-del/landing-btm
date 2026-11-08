import type { ElementType, ReactNode, Ref } from "react";

import { useInView } from "@/lib/use-in-view";

export function Mark({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

/** Párrafo con fragmentos resaltados, en el formato de `DIFERENCIA.parrafo`. */
export function RichText({ parts }: { parts: readonly (string | { mark: string })[] }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <span key={i} className="font-semibold text-primary">
            {part.mark}
          </span>
        ),
      )}
    </>
  );
}

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(to right, oklch(0.22 0 0) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.22 0 0) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
} as const;

export function GridBackground({
  className = "opacity-[0.15]",
  mask = "radial-gradient(ellipse at center, black 40%, transparent 80%)",
}: {
  className?: string;
  mask?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ ...GRID_STYLE, maskImage: mask }}
    />
  );
}

interface BandProps {
  children: ReactNode;
  /** Alternar el fondo da ritmo a una página larga. */
  tone?: "base" | "muted";
  grid?: boolean;
  width?: "default" | "narrow";
  id?: string;
  className?: string;
}

/** Sección a ancho completo con el contenido centrado. */
export function Band({
  children,
  tone = "base",
  grid = false,
  width = "default",
  id,
  className = "",
}: BandProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-20 overflow-x-clip ${className}`}
    >
      {tone === "muted" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_50%,oklch(0.9_0.18_110/0.05),transparent_70%)]"
        />
      )}
      {grid && (
        <div
          aria-hidden
          className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black_10%,transparent_75%)]"
        />
      )}
      <div
        className={`relative mx-auto w-full px-5 py-20 sm:px-8 sm:py-28 lg:py-32 ${
          width === "narrow" ? "max-w-3xl" : "max-w-6xl"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  highlight?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  highlight,
  eyebrow,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center" : "text-left"} ${className}`}>
      {eyebrow && (
        <div className={`mb-6 flex ${centered ? "justify-center" : ""}`}>
          <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.68rem] font-medium tracking-[0.2em] text-white/70 uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
            {eyebrow}
          </p>
        </div>
      )}
      <h2 className="text-[2.1rem] leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">
        <span className="text-fade">{title}</span>
        {highlight ? (
          <>
            {" "}
            <span className="text-shimmer">{highlight}</span>
          </>
        ) : null}
      </h2>
    </div>
  );
}

interface RevealProps {
  as?: ElementType;
  variant?: "up" | "fade" | "scale";
  /** Retraso en ms, para escalonar tarjetas dentro de una misma grilla. */
  delay?: number;
  className?: string;
  children: ReactNode;
}

const HIDDEN_CLASSES: Record<NonNullable<RevealProps["variant"]>, string> = {
  up: "opacity-0 translate-y-8 blur-sm",
  fade: "opacity-0 blur-sm",
  scale: "opacity-0 scale-90 blur-sm",
};

/**
 * Revela su contenido al entrar en pantalla. Arranca visible (ver
 * use-in-view.ts): si el JS falla o tarda, nada queda oculto.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay,
  className = "",
  children,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <Tag
      ref={ref as Ref<never>}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-[opacity,transform,filter] duration-1000 ease-[cubic-bezier(.2,.7,.2,1)] ${
        inView ? "translate-y-0 scale-100 opacity-100 blur-0" : HIDDEN_CLASSES[variant]
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
