import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useRef } from "react";

import { CtaButton, WhatsappIcon } from "@/components/funnel/fields";
import { FunnelLoading, FunnelShell } from "@/components/funnel/funnel-shell";
import { ProgressBar } from "@/components/funnel/progress-bar";
import { REGISTRO } from "@/content/evento";
import { trackEvent } from "@/lib/analytics";
import { advanceLeadStage } from "@/lib/funnel-api";
import { markTrackedOnce } from "@/lib/funnel-session";
import { EVENT_CONTENT_NAME, newEventId, trackPixelEvent } from "@/lib/pixel";
import { useFunnelSession } from "@/lib/use-funnel-session";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [{ title: "Registro completado — BTM Academy" }, { name: "robots", content: "noindex" }],
  }),
  component: RegistroPage,
});

/** Paso 3 de 3: confirmación al 100% con el resumen de datos. */
function RegistroPage() {
  const navigate = useNavigate();
  const { session, isReady } = useFunnelSession();
  // Strict Mode corre los efectos dos veces en dev; una conversión duplicada
  // ensucia los números de la campaña.
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!isReady) return;
    if (!session) {
      void navigate({ to: "/", replace: true });
      return;
    }
    if (hasTracked.current) return;
    hasTracked.current = true;

    const eventId = newEventId();
    // Recargar la página no cuenta otra conversión en el navegador; el
    // servidor tampoco la repite (solo la primera vez que llega a la etapa).
    if (markTrackedOnce(session.leadId, "CompleteRegistration")) {
      trackPixelEvent("CompleteRegistration", { content_name: EVENT_CONTENT_NAME }, eventId);
      trackEvent("sign_up", { method: "funnel" });
    }

    void advanceLeadStage({
      data: {
        id: session.leadId,
        stage: "registered",
        eventId,
        eventSourceUrl: window.location.href,
      },
    }).catch(() => undefined);
  }, [isReady, session, navigate]);

  if (!session) return <FunnelLoading />;

  return (
    <FunnelShell>
      <div className="animate-fade-up border-beam glass rounded-[28px] p-6 sm:p-10">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_-10px_var(--color-primary)]">
            <Check className="h-7 w-7" strokeWidth={3} />
          </span>
          <div>
            <p className="text-xs tracking-[0.28em] text-primary uppercase">Paso 3 de 3</p>
            <h1 className="mt-1 text-3xl leading-none font-medium tracking-tight break-words sm:text-5xl">
              Registro completado
            </h1>
          </div>
        </div>

        <p className="mt-5 text-base text-muted-foreground">{REGISTRO.texto(session.firstName)}</p>

        <div className="mt-8">
          <ProgressBar value={100} label="Registro completado" />
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          <SummaryItem label="Nombre" value={`${session.firstName} ${session.lastName}`} />
          <SummaryItem label="Celular" value={session.phoneE164} />
          <SummaryItem label="Correo" value={session.email} className="sm:col-span-2" />
        </dl>

        {session.whatsappGroupUrl && (
          <div className="mt-10">
            <CtaButton
              variant="outline"
              onClick={() => window.open(session.whatsappGroupUrl, "_blank", "noopener,noreferrer")}
            >
              <WhatsappIcon />
              {REGISTRO.boton}
            </CtaButton>
          </div>
        )}
      </div>
    </FunnelShell>
  );
}

function SummaryItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-background/50 px-4 py-3 ${className}`}>
      <dt className="text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 truncate text-sm text-foreground">{value}</dd>
    </div>
  );
}
