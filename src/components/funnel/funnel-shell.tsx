import type { ReactNode } from "react";

import btmLogo from "@/assets/btm-academy-logo.png";
import { Aurora } from "@/components/landing/fx";
import { HERO } from "@/content/evento";

/**
 * Armazón de los pasos internos del embudo (/procesando y /registro): una sola
 * tarjeta centrada en vertical. La landing no lo usa.
 */
export function FunnelShell({ children }: { children: ReactNode }) {
  return (
    <div className="noise relative isolate min-h-dvh overflow-hidden bg-background text-foreground">
      <Aurora />
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-x-0 bottom-0 h-1/2 origin-bottom [transform:perspective(600px)_rotateX(60deg)] [mask-image:linear-gradient(to_top,black,transparent_85%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:py-10">
        <header className="flex items-center justify-between gap-4">
          <img
            src={btmLogo}
            alt="BTM Academy"
            className="h-8 w-auto sm:h-9"
            width={720}
            height={311}
          />
          <span className="hidden text-xs tracking-[0.28em] text-muted-foreground uppercase sm:block">
            {HERO.insignia} · {HERO.estado}
          </span>
        </header>

        <main className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col justify-center py-10">
          {children}
        </main>

        <footer className="border-t border-border/60 pt-6 text-xs text-muted-foreground/80">
          <p>
            © {new Date().getFullYear()} BTM Academy. Formación educativa: no vendemos señales ni
            prometemos resultados financieros. Este sitio no está afiliado a Meta Platforms, Inc.
          </p>
        </footer>
      </div>
    </div>
  );
}

/** Mientras se lee la sesión del embudo (o se redirige al inicio). */
export function FunnelLoading() {
  return (
    <FunnelShell>
      <p className="text-center text-muted-foreground">Cargando...</p>
    </FunnelShell>
  );
}
