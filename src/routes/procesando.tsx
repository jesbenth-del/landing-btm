import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CtaButton, WhatsappIcon } from "@/components/funnel/fields";
import { FunnelLoading, FunnelShell } from "@/components/funnel/funnel-shell";
import { ProgressBar } from "@/components/funnel/progress-bar";
import { PROCESANDO } from "@/content/evento";
import { trackEvent } from "@/lib/analytics";
import { advanceLeadStage } from "@/lib/funnel-api";
import { markTrackedOnce } from "@/lib/funnel-session";
import {
  EVENT_CONTENT_NAME,
  newEventId,
  trackPixelCustomEvent,
  trackPixelEvent,
} from "@/lib/pixel";
import { useFunnelSession } from "@/lib/use-funnel-session";

export const Route = createFileRoute("/procesando")({
  head: () => ({
    meta: [{ title: "Paso 2 de 3 — BTM Academy" }, { name: "robots", content: "noindex" }],
  }),
  component: ProcesandoPage,
});

/** Paso 2 de 3: barra al 79% y el llamado a unirse al grupo de WhatsApp. */
function ProcesandoPage() {
  const navigate = useNavigate();
  const { session, isReady } = useFunnelSession();
  const [isJoining, setIsJoining] = useState(false);
  const hasMarked = useRef(false);

  useEffect(() => {
    if (!isReady) return;
    if (!session) {
      void navigate({ to: "/", replace: true });
      return;
    }
    if (hasMarked.current) return;
    hasMarked.current = true;
    void advanceLeadStage({ data: { id: session.leadId, stage: "progress_viewed" } }).catch(
      () => undefined,
    );
  }, [isReady, session, navigate]);

  const handleJoin = async () => {
    if (!session) return;
    setIsJoining(true);

    /*
      `Lead` ("Cliente potencial" en Events Manager) es el evento por el que se
      optimiza la campaña. El servidor lo repite por la Conversions API con
      este mismo eventId para que Meta cuente uno solo.
    */
    const leadEventId = newEventId();
    if (markTrackedOnce(session.leadId, "Lead")) {
      trackPixelEvent("Lead", { content_name: EVENT_CONTENT_NAME }, leadEventId);
      trackPixelCustomEvent("WhatsAppJoin", {}, newEventId());
      trackEvent("join_whatsapp_group");
    }

    // Antes del await a propósito: después el navegador ya no lo trata como
    // gesto del usuario y bloquea la pestaña nueva.
    if (session.whatsappGroupUrl) {
      window.open(session.whatsappGroupUrl, "_blank", "noopener,noreferrer");
    }

    await advanceLeadStage({
      data: {
        id: session.leadId,
        stage: "whatsapp_joined",
        eventId: leadEventId,
        eventSourceUrl: window.location.href,
      },
    }).catch(() => undefined);

    await navigate({ to: "/registro" });
  };

  if (!session) return <FunnelLoading />;

  return (
    <FunnelShell>
      <div className="animate-fade-up border-beam glass rounded-[28px] p-6 sm:p-10">
        <p className="text-xs tracking-[0.28em] text-primary uppercase">Paso 2 de 3</p>

        <h1 className="mt-4 text-3xl leading-tight font-medium tracking-tight break-words sm:text-5xl">
          {PROCESANDO.titulo(session.firstName)}
        </h1>

        <p className="mt-4 text-base text-muted-foreground">
          {PROCESANDO.bajadaAntes}{" "}
          <span className="font-semibold text-primary">{PROCESANDO.bajadaResaltado}</span>{" "}
          {PROCESANDO.bajadaDespues}
        </p>

        <div className="mt-8">
          <ProgressBar value={session.progressPercentage} label="Registro completado" />
        </div>

        <ul className="mt-8 flex flex-col gap-3">
          {PROCESANDO.checklist.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3"
            >
              {item.done ? (
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              ) : (
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-dashed border-muted-foreground/60">
                  <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
                </span>
              )}
              <span
                className={`text-sm ${item.done ? "text-foreground/80" : "text-muted-foreground"}`}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <CtaButton variant="whatsapp" onClick={handleJoin} loading={isJoining}>
            <WhatsappIcon />
            {PROCESANDO.boton}
          </CtaButton>
        </div>

        <ul className="mt-6 flex flex-col gap-2 text-xs leading-relaxed text-muted-foreground">
          {PROCESANDO.notas.map((nota) => (
            <li key={nota}>{nota}</li>
          ))}
        </ul>

        <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
          <span aria-hidden>🔒</span>
          <span>Tu información está protegida. Grupo libre de spam.</span>
        </p>
      </div>
    </FunnelShell>
  );
}
