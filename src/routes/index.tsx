import { createFileRoute } from "@tanstack/react-router";

import { StickyCta } from "@/components/funnel/sticky-cta";
import { CursorGlow, FloatingNav } from "@/components/landing/fx";
import { HeroSection } from "@/components/landing/hero-section";
import {
  AudienceSection,
  DifferenceSection,
  FaqSection,
  FilterMatrixSection,
  FinalCtaSection,
  LearningsSection,
  MentorSection,
  ProofStrip,
} from "@/components/landing/sections";
import { SiteFooter } from "@/components/site-footer";
import { FAQ_ITEMS, SEO } from "@/content/evento";
import { textosDelEvento } from "@/lib/evento";
import { getEventoPublico } from "@/lib/funnel-api";

function buildFaqStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export const Route = createFileRoute("/")({
  /** Fecha, hora y zona del evento: se editan en /admin, sin redesplegar. */
  loader: () => getEventoPublico(),
  staleTime: 60_000,
  head: () => ({
    meta: [
      { title: SEO.title },
      { name: "description", content: SEO.description },
      { property: "og:title", content: SEO.title },
      { property: "og:description", content: SEO.description },
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

/**
 * Orden de la página (el mismo de Radar Gastronómico), siguiendo el recorrido
 * de alguien que llega desde una pauta y no conoce la marca:
 *
 *  1. Héroe con formulario y quién enseña, todo sobre el pliegue.
 *  2. Credibilidad inmediata: cifras.
 *  3. ¿Eres tú? — audiencia y los cuatro perfiles.
 *  4. Por qué esta sesión y no otra.
 *  5. Qué se lleva de la sesión.
 *  6. Quién enseña, con la historia completa.
 *  7. Filtro honesto de a quién NO le sirve.
 *  8. Preguntas frecuentes.
 *  9. Agenda y último llamado.
 *
 * Todo el copy vive en src/content/evento.ts.
 */
function Index() {
  const evento = textosDelEvento(Route.useLoaderData());

  return (
    <div className="noise relative min-h-screen bg-background text-foreground">
      <CursorGlow />
      <FloatingNav />
      <main className="relative pb-24 lg:pb-0">
        <HeroSection evento={evento} />
        <ProofStrip />
        <AudienceSection />
        <DifferenceSection />
        <LearningsSection evento={evento} />
        <MentorSection />
        <FilterMatrixSection />
        <FaqSection />
        <FinalCtaSection evento={evento} />
      </main>
      <SiteFooter />
      <StickyCta startsAt={evento.startsAt} />
    </div>
  );
}
