import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import btmLogo from "@/assets/btm-academy-logo.png";
import { CtaButton, TextField } from "@/components/funnel/fields";
import { adminLogin, getAdminSession } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const { authenticated } = await getAdminSession();
    if (authenticated) throw redirect({ to: "/admin" });
  },
  head: () => ({
    meta: [{ title: "Admin — BTM Academy" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await adminLogin({ data: { password } });
      await navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Ocurrió un error inesperado. Inténtalo de nuevo.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-5 text-foreground">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <img src={btmLogo} alt="BTM Academy" className="h-8 w-auto" width={720} height={311} />
        <p className="mt-6 text-xl font-medium tracking-tight">Panel de administración</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ingresa la contraseña para ver los leads.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <CtaButton type="submit" loading={isSubmitting} disabled={!password}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </CtaButton>
        </form>
      </div>
    </div>
  );
}
