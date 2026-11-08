import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ExternalLink, LogOut, Search, Sparkles } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import btmLogo from "@/assets/btm-academy-logo.png";
import { CtaButton, TextField } from "@/components/funnel/fields";
import { Aurora, SpotlightCard } from "@/components/landing/fx";
import { formatBytes, toolHref, toolMeta } from "@/lib/tool-meta";
import { getStudentArea, studentLogin, studentLogout, type PublicTool } from "@/lib/tools-api";

export const Route = createFileRoute("/herramientas/")({
  loader: () => getStudentArea(),
  head: () => ({
    meta: [
      { title: "Herramientas — BTM Academy" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HerramientasPage,
});

function HerramientasPage() {
  const { email, tools } = Route.useLoaderData();

  return (
    <div className="noise relative isolate min-h-dvh overflow-x-clip bg-background text-foreground">
      <Aurora />
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[60vh] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent_75%)]"
      />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <a href="/" aria-label="BTM Academy">
            <img src={btmLogo} alt="BTM Academy" className="h-8 w-auto" width={720} height={311} />
          </a>
          {email && <LogoutButton email={email} />}
        </header>

        {email ? <ToolsArea tools={tools} /> : <LoginCard />}

        <footer className="mt-16 border-t border-white/[0.06] pt-6 text-xs text-white/35">
          © {new Date().getFullYear()} BTM Academy · Material exclusivo para miembros de la comunidad.
          No lo compartas fuera de ella.
        </footer>
      </div>
    </div>
  );
}

/* ---------- Acceso ---------- */

function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await studentLogin({ data: { email } });
      await router.invalidate();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "No pudimos verificar tu correo. Inténtalo de nuevo.",
      );
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.68rem] font-medium tracking-[0.2em] text-white/70 uppercase">
            <Sparkles className="size-3.5 text-primary" /> Zona de miembros
          </span>
          <h1 className="mt-6 text-4xl leading-[1.02] font-semibold tracking-[-0.03em] sm:text-5xl">
            <span className="text-fade">Herramientas de </span>
            <span className="text-shimmer">la comunidad</span>
          </h1>
          <p className="mt-4 text-white/55">
            Plantillas, guías y recursos exclusivos para estudiantes de BTM Academy.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="border-beam glass mt-10 flex flex-col gap-4 rounded-[28px] p-6 sm:p-8"
        >
          <TextField
            label="Tu correo"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="El correo con el que te registraste"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <CtaButton type="submit" loading={loading} disabled={!email.trim()}>
            {loading ? "Verificando..." : "Entrar"}
          </CtaButton>
        </form>
      </div>
    </main>
  );
}

function LogoutButton({ email }: { email: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-white/45 sm:inline">{email}</span>
      <button
        type="button"
        onClick={async () => {
          await studentLogout();
          await router.invalidate();
        }}
        className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/75 transition-colors hover:text-white"
      >
        <LogOut className="size-3.5" /> Salir
      </button>
    </div>
  );
}

/* ---------- Herramientas ---------- */

function ToolsArea({ tools }: { tools: PublicTool[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((t) => `${t.title} ${t.description}`.toLowerCase().includes(q));
  }, [tools, query]);

  return (
    <main className="flex-1 pt-14 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.68rem] font-medium tracking-[0.2em] text-white/70 uppercase">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
            Zona de miembros
          </span>
          <h1 className="mt-5 text-4xl leading-[1.02] font-semibold tracking-[-0.03em] sm:text-6xl">
            <span className="text-fade">Tus </span>
            <span className="text-shimmer">herramientas</span>
          </h1>
          <p className="mt-3 text-white/55">
            {tools.length} recurso{tools.length === 1 ? "" : "s"} para operar con estructura.
          </p>
        </div>
        {tools.length > 4 && (
          <label className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/35" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar herramienta..."
              className="h-11 w-full rounded-full border border-white/10 bg-black/40 pr-4 pl-11 text-sm outline-none placeholder:text-white/30 focus:border-primary/60"
            />
          </label>
        )}
      </div>

      {tools.length === 0 ? (
        <div className="glass mt-12 rounded-3xl p-10 text-center text-white/55">
          Muy pronto vas a encontrar aquí las primeras herramientas.
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-12 text-center text-white/45">Ninguna herramienta coincide con “{query}”.</p>
      ) : (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => {
            const { label, Icon } = toolMeta(tool);
            return (
              <SpotlightCard
                key={tool.id}
                className="group flex h-full flex-col p-6 [animation:fade-up_.7s_cubic-bezier(.2,.7,.2,1)_both]"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-wide text-white/50 uppercase">
                    {label}
                    {tool.size ? ` · ${formatBytes(tool.size)}` : ""}
                  </span>
                </div>
                <h2 className="mt-6 text-lg leading-snug font-semibold tracking-tight">{tool.title}</h2>
                {tool.description && (
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{tool.description}</p>
                )}
                <div className="mt-auto flex gap-2 pt-6">
                  <a
                    href={toolHref(tool)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_30px_-6px_var(--color-primary)]"
                  >
                    Abrir <ExternalLink className="size-3.5" />
                  </a>
                  {tool.kind === "file" && (
                    <a
                      href={`${toolHref(tool)}?descargar=1`}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/75 transition-colors hover:border-white/25 hover:text-white"
                    >
                      Descargar
                    </a>
                  )}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}
    </main>
  );
}
