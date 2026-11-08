import { ArrowRight } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

import btmLogo from "@/assets/btm-academy-logo.png";
import { NAV } from "@/content/evento";

/* ---------- Brillo que sigue al cursor (toda la página) ---------- */

/**
 * Un halo lima muy suave detrás del contenido que sigue al puntero. Solo en
 * dispositivos con mouse: en táctil no hay cursor que seguir.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    const move = (e: globalThis.PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${x - 350}px, ${y - 350}px, 0)`;
          el.style.opacity = "1";
          frame = 0;
        });
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-0 size-[700px] rounded-full opacity-0 transition-opacity duration-700"
      style={{
        background: "radial-gradient(circle, oklch(0.9 0.18 110 / 0.07), transparent 60%)",
      }}
    />
  );
}

/* ---------- Tarjeta con spotlight ---------- */

/** Tarjeta que se ilumina (fondo y borde) en el punto donde está el cursor. */
export function SpotlightCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div onPointerMove={onMove} className={`spotlight glass rounded-3xl ${className}`} style={style}>
      <span aria-hidden className="spotlight-border" />
      {children}
    </div>
  );
}

/* ---------- Titular palabra por palabra ---------- */

export function WordReveal({
  text,
  className = "",
  baseDelay = 0,
  start = 0,
}: {
  text: string;
  className?: string;
  /** Retraso inicial en ms. */
  baseDelay?: number;
  /** Índice de la primera palabra, para encadenar varios WordReveal. */
  start?: number;
}) {
  return (
    // El degradado va en cada palabra: background-clip:text no atraviesa hijos
    // inline-block animados (cada uno crea su propia capa).
    <span className="word-reveal" style={{ "--base": `${baseDelay}ms` } as CSSProperties}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} style={{ "--i": start + i } as CSSProperties}>
          <span className={className}>{word}</span>
          {" "}
        </span>
      ))}
    </span>
  );
}

/* ---------- Manchas de luz ---------- */

export function Aurora({
  className = "",
  fadeEdges = false,
}: {
  className?: string;
  /** Difumina arriba y abajo para que la luz no se corte en seco con la sección vecina. */
  fadeEdges?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        fadeEdges
          ? "[mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
          : ""
      } ${className}`}
    >
      <div className="animate-aurora absolute -top-1/4 left-[10%] size-[42rem] rounded-full bg-primary/[0.09] blur-[140px]" />
      <div
        className="animate-aurora absolute top-1/3 -right-1/4 size-[38rem] rounded-full bg-[oklch(0.75_0.15_150)]/[0.07] blur-[150px]"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="animate-aurora absolute -bottom-1/3 left-1/3 size-[34rem] rounded-full bg-primary/[0.05] blur-[150px]"
        style={{ animationDelay: "-13s" }}
      />
    </div>
  );
}

/* ---------- Gráfico de mercado del héroe ---------- */

/** PRNG con semilla: el gráfico sale idéntico en servidor y navegador (sin desajuste al hidratar). */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Candle {
  o: number;
  c: number;
  h: number;
  l: number;
}

/**
 * Cuenta la metodología sin texto: el precio sube con estructura, retrocede
 * hasta una zona marcada (la "zona validada") y desde ahí rompe al alza.
 */
function buildCandles(): Candle[] {
  const rand = mulberry32(7);
  // Objetivos del cierre por tramo: impulso, retroceso a la zona, expansión.
  const legs = [
    { n: 14, drift: 1.3 },
    { n: 9, drift: -1.6 },
    { n: 5, drift: 0.2 },
    { n: 16, drift: 2.1 },
  ];
  const candles: Candle[] = [];
  let price = 40;
  for (const leg of legs) {
    for (let i = 0; i < leg.n; i++) {
      const o = price;
      const c = o + leg.drift + (rand() - 0.5) * 4.2;
      const h = Math.max(o, c) + rand() * 2.4;
      const l = Math.min(o, c) - rand() * 2.4;
      candles.push({ o, c, h, l });
      price = c;
    }
  }
  return candles;
}

const CANDLES = buildCandles();

export function MarketChart({ className = "" }: { className?: string }) {
  const W = 1200;
  const H = 640;
  const pad = 40;
  const max = Math.max(...CANDLES.map((k) => k.h)) + 4;
  const min = Math.min(...CANDLES.map((k) => k.l)) - 4;
  const y = (v: number) => pad + ((max - v) / (max - min)) * (H - pad * 2);
  const step = (W - pad * 2) / CANDLES.length;
  const x = (i: number) => pad + step * i + step / 2;

  const line = CANDLES.map((k, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(k.c).toFixed(1)}`).join(" ");
  const area = `${line} L${x(CANDLES.length - 1)},${H} L${x(0)},${H} Z`;

  // La zona: el mínimo del retroceso (velas 14 a 27).
  const pullback = CANDLES.slice(14, 28);
  const zoneLow = Math.min(...pullback.map((k) => k.l));
  const zoneTop = zoneLow + 6;
  const last = CANDLES.length - 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="mc-line" x1="0" x2="1">
          <stop offset="0" stopColor="oklch(0.9 0.18 110)" stopOpacity="0.1" />
          <stop offset="0.6" stopColor="oklch(0.9 0.18 110)" stopOpacity="0.8" />
          <stop offset="1" stopColor="oklch(1 0 0)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="mc-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.9 0.18 110)" stopOpacity="0.16" />
          <stop offset="1" stopColor="oklch(0.9 0.18 110)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Zona validada */}
      <g
        style={{
          transformOrigin: `${x(14)}px ${y(zoneTop)}px`,
          animation: "zone-in 1s cubic-bezier(.2,.7,.2,1) 1.6s both",
        }}
      >
        <rect
          x={x(14) - step}
          y={y(zoneTop)}
          width={W - x(14)}
          height={y(zoneLow) - y(zoneTop)}
          fill="oklch(0.9 0.18 110 / 0.08)"
          stroke="oklch(0.9 0.18 110 / 0.5)"
          strokeDasharray="6 6"
        />
        <text
          x={x(14)}
          y={y(zoneLow) + 22}
          fill="oklch(0.9 0.18 110 / 0.85)"
          fontSize="13"
          fontFamily="ui-monospace, monospace"
          letterSpacing="2"
        >
          ZONA VALIDADA
        </text>
      </g>

      {/* Velas */}
      {CANDLES.map((k, i) => {
        const up = k.c >= k.o;
        const color = up ? "oklch(0.9 0.18 110 / 0.75)" : "oklch(1 0 0 / 0.22)";
        return (
          <g
            key={i}
            style={{
              transformOrigin: `${x(i)}px ${y((k.o + k.c) / 2)}px`,
              animation: `candle-grow .5s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.035}s both`,
            }}
          >
            <line x1={x(i)} x2={x(i)} y1={y(k.h)} y2={y(k.l)} stroke={color} strokeWidth="1.5" />
            <rect
              x={x(i) - step * 0.3}
              y={y(Math.max(k.o, k.c))}
              width={step * 0.6}
              height={Math.max(2, Math.abs(y(k.o) - y(k.c)))}
              rx="1.5"
              fill={up ? color : "transparent"}
              stroke={color}
            />
          </g>
        );
      })}

      {/* Línea de cierres y su área */}
      <path d={area} fill="url(#mc-area)" style={{ animation: "fade-up 1.2s ease-out 1.4s both" }} />
      <path
        d={line}
        fill="none"
        stroke="url(#mc-line)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
        style={{ animation: "draw-line 2.4s cubic-bezier(.65,0,.35,1) .3s forwards" }}
      />

      {/* Precio actual latiendo */}
      <g style={{ animation: "fade-up .6s ease-out 2.6s both" }}>
        <circle
          cx={x(last)}
          cy={y(CANDLES[last].c)}
          r="6"
          fill="oklch(0.9 0.18 110)"
          style={{
            transformOrigin: `${x(last)}px ${y(CANDLES[last].c)}px`,
            animation: "ping-soft 2s ease-out 3s infinite",
          }}
        />
        <circle cx={x(last)} cy={y(CANDLES[last].c)} r="5" fill="oklch(0.9 0.18 110)" />
      </g>
    </svg>
  );
}

/* ---------- Navegación flotante ---------- */

/** Barra en forma de píldora que flota arriba y se compacta al hacer scroll. */
export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
      <nav
        className={`pointer-events-auto flex w-full items-center justify-between gap-4 rounded-full border px-3 py-2 pl-5 transition-all duration-500 ${
          scrolled
            ? "max-w-3xl border-white/10 bg-black/55 shadow-[0_20px_60px_-20px_rgba(0,0,0,.9)] backdrop-blur-xl"
            : "max-w-6xl border-transparent bg-transparent"
        }`}
      >
        <a href="#top" aria-label="BTM Academy" className="shrink-0">
          <img src={btmLogo} alt="BTM Academy" className="h-7 w-auto" width={720} height={311} />
        </a>
        <div className="hidden items-center gap-1 text-[13px] text-white/60 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#registro"
          className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-[transform,box-shadow] hover:shadow-[0_0_30px_-4px_var(--color-primary)] active:scale-95"
        >
          Reservar cupo
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </nav>
    </div>
  );
}
