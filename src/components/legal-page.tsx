import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import btmLogo from "@/assets/btm-academy-logo.png";
import { SiteFooter } from "@/components/site-footer";

type LegalPageProps = {
  title: string;
  effectiveDate?: string;
  children: ReactNode;
};

export function LegalPage({ title, effectiveDate, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <Link to="/" aria-label="Volver a BTM Academy" className="flex items-center">
            <img
              src={btmLogo}
              alt="BTM Academy"
              className="h-8 w-auto sm:h-9"
              width={720}
              height={311}
              loading="eager"
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">{title}</h1>
        {effectiveDate && (
          <p className="mt-2 text-sm text-muted-foreground">
            Fecha de entrada en vigencia: {effectiveDate}
          </p>
        )}
        <div className="mt-8">{children}</div>
        <p className="mt-10">
          <Link
            to="/"
            className="text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Volver a la página principal
          </Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
