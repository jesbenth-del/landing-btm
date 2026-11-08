import { useEffect, useState, type FormEvent } from "react";

import { ZONA_HORARIA } from "@/content/evento";
import { fetchEventoConfig, isUnauthorized, saveEventoConfig } from "@/lib/admin-api";
import { dateFormatter } from "@/lib/admin-leads";
import { horaLegible, isoDesde, textosDelEvento } from "@/lib/evento";

type EventoGuardado = Awaited<ReturnType<typeof fetchEventoConfig>>;

interface EventoEditable {
  campana: string;
  whatsappGroupUrl: string;
  fecha: string;
  hora: string;
}

const VACIO: EventoEditable = { campana: "", whatsappGroupUrl: "", fecha: "", hora: "" };

export const adminInputClass =
  "h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60";
export const adminLabelClass =
  "text-[0.65rem] font-medium tracking-[0.18em] text-muted-foreground uppercase";

const fechasDe = (fecha: string, hora: string, zona: string) =>
  textosDelEvento({ inicio: isoDesde(fecha, hora), hora: horaLegible(hora), zona });

/**
 * Fecha, hora, convocatoria y grupo de WhatsApp del evento vigente. Lo que se
 * guarda aquí lo lee la landing en segundos, sin volver a desplegar, y la
 * convocatoria queda marcada en cada lead que se registre desde ese momento.
 */
export function EventoConfigPanel({
  onSaved,
  onUnauthorized,
}: {
  onSaved: () => void;
  onUnauthorized: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [guardado, setGuardado] = useState<EventoGuardado | null>(null);
  const [form, setForm] = useState<EventoEditable>(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const aplicar = (evento: EventoGuardado) => {
    setGuardado(evento);
    setForm({
      campana: evento.campana,
      whatsappGroupUrl: evento.whatsappGroupUrl,
      fecha: evento.fecha,
      hora: evento.hora,
    });
  };

  useEffect(() => {
    fetchEventoConfig()
      .then(aplicar)
      .catch((err: unknown) => {
        if (isUnauthorized(err)) onUnauthorized();
        else setError("No se pudo leer la configuración del evento.");
      });
  }, [onUnauthorized]);

  const cambiar = (campo: keyof EventoEditable, valor: string) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setAviso(null);
  };

  const sinCambios =
    guardado !== null &&
    form.campana === guardado.campana &&
    form.whatsappGroupUrl === guardado.whatsappGroupUrl &&
    form.fecha === guardado.fecha &&
    form.hora === guardado.hora;

  const zona = guardado?.zona ?? ZONA_HORARIA.etiqueta;
  const vistaPrevia = form.fecha && form.hora ? fechasDe(form.fecha, form.hora, zona) : null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setGuardando(true);
    setError(null);
    setAviso(null);

    try {
      const evento = await saveEventoConfig({
        data: {
          campana: form.campana.trim(),
          whatsappGroupUrl: form.whatsappGroupUrl.trim(),
          fecha: form.fecha,
          hora: form.hora,
        },
      });
      aplicar(evento);
      setAviso("Guardado. La landing ya muestra la nueva fecha.");
      onSaved();
    } catch (err) {
      if (isUnauthorized(err)) {
        onUnauthorized();
        return;
      }
      setError(
        err instanceof Error && err.message ? err.message : "No se pudo guardar. Inténtalo de nuevo.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="mt-6 rounded-xl border border-border bg-card px-5 py-4">
      <button
        type="button"
        onClick={() => setAbierto((actual) => !actual)}
        aria-expanded={abierto}
        className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Configuración del evento
          </span>
          <span className="mt-1 block text-sm text-foreground/80">
            {guardado
              ? `${guardado.campana || "Sin convocatoria"} · ${
                  guardado.fecha ? fechasDe(guardado.fecha, guardado.hora, zona).dates : "sin fecha"
                } · ${guardado.horaLegible || "sin hora"}`
              : "Cargando..."}
          </span>
        </span>
        <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {abierto ? "Cerrar ▲" : "Editar ▼"}
        </span>
      </button>

      {abierto && (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="evento-campana" className={adminLabelClass}>
                Convocatoria
              </label>
              <input
                id="evento-campana"
                type="text"
                required
                maxLength={60}
                placeholder="Sesión 15 de noviembre"
                value={form.campana}
                onChange={(e) => cambiar("campana", e.target.value)}
                className={`${adminInputClass} min-w-[13rem]`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="evento-fecha" className={adminLabelClass}>
                Fecha
              </label>
              <input
                id="evento-fecha"
                type="date"
                required
                value={form.fecha}
                onChange={(e) => cambiar("fecha", e.target.value)}
                className={adminInputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="evento-hora" className={adminLabelClass}>
                Hora ({zona})
              </label>
              <input
                id="evento-hora"
                type="time"
                required
                value={form.hora}
                onChange={(e) => cambiar("hora", e.target.value)}
                className={adminInputClass}
              />
            </div>
            <div className="flex min-w-[18rem] flex-1 flex-col gap-1.5">
              <label htmlFor="evento-whatsapp" className={adminLabelClass}>
                Enlace del grupo de WhatsApp
              </label>
              <input
                id="evento-whatsapp"
                type="url"
                required
                placeholder="https://chat.whatsapp.com/..."
                value={form.whatsappGroupUrl}
                onChange={(e) => cambiar("whatsappGroupUrl", e.target.value)}
                className={adminInputClass}
              />
            </div>
          </div>

          {vistaPrevia && (
            <p className="text-sm text-muted-foreground">
              Así se verá: <span className="text-foreground">{vistaPrevia.dates}</span> a las{" "}
              <span className="text-foreground">{vistaPrevia.time}</span> ({vistaPrevia.timezone}).{" "}
              {vistaPrevia.agenda.map((s) => `${s.badge}: ${s.day}`).join(" · ")}.
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Los leads que se registren desde que guardes quedan marcados con esta convocatoria. Los
            anteriores conservan la suya.
            {guardado?.actualizado
              ? ` Último cambio: ${dateFormatter.format(new Date(guardado.actualizado))}.`
              : " Todavía no se ha guardado aquí: estos valores salen de las variables de entorno."}
          </p>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          {aviso && (
            <p role="status" className="text-sm text-primary">
              {aviso}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={guardando || sinCambios}
              className="h-10 rounded-md bg-primary px-5 text-xs font-semibold text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
