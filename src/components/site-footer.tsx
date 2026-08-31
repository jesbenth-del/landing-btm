import { Link } from "@tanstack/react-router";
import btmLogo from "@/assets/btm-academy-logo.png";

export function SiteFooter() {
  return (
    <footer className="py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <img
            src={btmLogo}
            alt="BTM Academy — academia de trading en Forex, Oro e Índices"
            className="h-9 w-auto"
            width={720}
            height={311}
            loading="lazy"
          />
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            Formación educativa. No vendemos señales ni prometemos resultados financieros. Operar en
            mercados financieros conlleva riesgo.
          </p>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BTM Academy
          </div>
        </div>
        <nav
          aria-label="Enlaces legales"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-6 text-xs"
        >
          <Link
            to="/politica-de-privacidad"
            className="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Política de Privacidad
          </Link>
          <Link
            to="/politica-de-cookies"
            className="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Política de Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}
