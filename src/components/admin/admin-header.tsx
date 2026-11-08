import { Link, useNavigate } from "@tanstack/react-router";

import btmLogo from "@/assets/btm-academy-logo.png";
import { adminLogout } from "@/lib/admin-api";

const TABS = [
  { to: "/admin", label: "Leads" },
  { to: "/admin/herramientas", label: "Herramientas" },
] as const;

/** Cabecera común del panel: logo, pestañas y cerrar sesión. */
export function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <img src={btmLogo} alt="BTM Academy" className="h-7 w-auto" width={720} height={311} />
        <nav className="flex gap-1 rounded-full border border-border bg-card p-1 text-sm">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-4 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-primary text-primary-foreground hover:text-primary-foreground" }}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      <button
        type="button"
        onClick={async () => {
          await adminLogout().catch(() => undefined);
          await navigate({ to: "/admin/login", replace: true });
        }}
        className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
