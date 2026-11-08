import { useEffect, useState } from "react";

import { STICKY } from "@/content/evento";

import { Countdown } from "./countdown";

/**
 * Barra fija que aparece cuando el formulario del héroe ya salió de pantalla.
 * Mientras el formulario es visible no se muestra: taparía media pantalla del
 * móvil justo cuando el visitante está escribiendo.
 *
 * Se ancla con IntersectionObserver sobre el propio formulario en vez de con
 * un umbral de scroll, porque el alto del héroe cambia con el ancho.
 */
export function StickyCta({ startsAt }: { startsAt: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById("registro");
    if (!anchor) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "-80px 0px 0px 0px",
    });

    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-3xl border border-white/10 bg-black/60 px-4 py-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,.9)] backdrop-blur-xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] sm:rounded-full sm:py-2.5 sm:pr-2.5 sm:pl-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"
      }`}
      /* Fuera de pantalla no debe ser enfocable con el teclado. */
      aria-hidden={!visible}
      inert={!visible}
    >
      {/* En móvil la cuenta atrás va encima del botón; en escritorio, al lado. */}
      <Countdown startsAt={startsAt} className="mb-2 sm:hidden" />
      <div className="flex items-center justify-between gap-4">
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold text-foreground">{STICKY.titulo}</p>
          <p className="truncate text-xs text-muted-foreground">{STICKY.bajada}</p>
        </div>
        <div className="ml-auto hidden sm:block">
          <Countdown startsAt={startsAt} className="flex-nowrap" />
        </div>
        <a
          href="#registro"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_40px_-6px_var(--color-primary)] sm:flex-none"
        >
          {STICKY.boton}
        </a>
      </div>
    </div>
  );
}
