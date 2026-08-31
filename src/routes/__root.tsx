import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import btmLogo from "@/assets/btm-academy-logo.png";
import { CookieConsentProvider } from "@/components/cookie-consent";

const siteUrl = import.meta.env.VITE_SITE_URL ?? "";
const ogImage = siteUrl ? `${siteUrl}/og-image.png` : "/og-image.png";
const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID ?? "";
const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID ?? "";

/** EEA + UK + CH — Consent Mode v2 defaults to denied until user accepts. */
const CONSENT_REQUIRED_REGIONS = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "GB",
  "CH",
  "NO",
  "IS",
  "LI",
] as const;

function buildStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        name: "BTM Academy",
        url: siteUrl || undefined,
        logo: siteUrl ? `${siteUrl}/og-image.png` : undefined,
        description:
          "Formación premium en Forex, Oro e Índices. Una metodología clara para conectar estructura, contexto y validación.",
        inLanguage: "es",
      },
      {
        "@type": "WebSite",
        name: "BTM Academy",
        url: siteUrl || undefined,
        inLanguage: "es",
      },
    ],
  };
}

function buildAnalyticsScripts() {
  const scripts: Array<{ type?: string; src?: string; async?: boolean; children?: string }> = [];

  if (gaId) {
    const consentRegions = JSON.stringify(CONSENT_REQUIRED_REGIONS);
    scripts.push({
      src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
      async: true,
    });
    scripts.push({
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          wait_for_update: 500,
          region: ${consentRegions}
        });
        gtag('consent', 'default', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted'
        });
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `.trim(),
    });
  }

  if (clarityId) {
    scripts.push({
      children: `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `.trim(),
    });
  }

  return scripts;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BTM Academy — Entiende lo que mueve el mercado" },
      {
        name: "description",
        content:
          "Formación premium en Forex, Oro e Índices. Una metodología clara para conectar estructura, contexto y validación. Sin promesas, con criterio.",
      },
      { name: "author", content: "BTM Academy" },
      { property: "og:title", content: "BTM Academy — Entiende lo que mueve el mercado" },
      {
        property: "og:description",
        content:
          "Formación premium en Forex, Oro e Índices. Una metodología clara para conectar estructura, contexto y validación. Sin promesas, con criterio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      ...(siteUrl
        ? [
            { property: "og:url", content: siteUrl },
            { property: "og:locale", content: "es_ES" },
          ]
        : []),
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "BTM Academy — Entiende lo que mueve el mercado" },
      {
        name: "twitter:description",
        content:
          "Formación premium en Forex, Oro e Índices. Una metodología clara para conectar estructura, contexto y validación. Sin promesas, con criterio.",
      },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      ...(siteUrl ? [{ rel: "canonical", href: siteUrl }] : []),
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", type: "image/png", href: btmLogo },
      { rel: "apple-touch-icon", href: btmLogo },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildStructuredData()),
      },
      ...buildAnalyticsScripts(),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <CookieConsentProvider />
    </QueryClientProvider>
  );
}
