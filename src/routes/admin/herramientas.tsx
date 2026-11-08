import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ExternalLink, Eye, EyeOff, Search, Trash2, Upload, UserPlus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { AdminHeader } from "@/components/admin/admin-header";
import { adminInputClass, adminLabelClass } from "@/components/admin/evento-config-panel";
import { getAdminSession, isUnauthorized } from "@/lib/admin-api";
import { dateFormatter } from "@/lib/admin-leads";
import { formatBytes, guessLinkType, LINK_TYPE_OPTIONS, toolHref, toolMeta } from "@/lib/tool-meta";
import {
  adminAddEmails,
  adminCreateLink,
  adminDeleteTool,
  adminFinishUpload,
  adminListEmails,
  adminListTools,
  adminRemoveEmail,
  adminUpdateTool,
  adminUploadPart,
  MAX_FILE_MB,
  UPLOAD_PART_BYTES,
  type AllowedEmail,
  type LinkType,
  type PublicTool,
} from "@/lib/tools-api";

export const Route = createFileRoute("/admin/herramientas")({
  beforeLoad: async () => {
    const { authenticated } = await getAdminSession();
    if (!authenticated) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [
      { title: "Herramientas — Admin BTM Academy" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminHerramientasPage,
});

const errorText = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

function AdminHerramientasPage() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<PublicTool[] | null>(null);
  const [emails, setEmails] = useState<AllowedEmail[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (isUnauthorized(err)) {
        void navigate({ to: "/admin/login", replace: true });
        return;
      }
      setError(errorText(err, fallback));
    },
    [navigate],
  );

  const loadTools = useCallback(
    () => adminListTools().then(setTools).catch((e) => handleError(e, "No se pudieron cargar las herramientas.")),
    [handleError],
  );
  const loadEmails = useCallback(
    () => adminListEmails().then(setEmails).catch((e) => handleError(e, "No se pudieron cargar los correos.")),
    [handleError],
  );

  useEffect(() => {
    void loadTools();
    void loadEmails();
  }, [loadTools, loadEmails]);

  return (
    <div className="min-h-dvh bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader />

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Herramientas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Lo que publiques aquí lo ven los correos autorizados en{" "}
              <a href="/herramientas" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
                /herramientas
              </a>
              .
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error}
            <button type="button" onClick={() => setError(null)} aria-label="Cerrar">
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="flex min-w-0 flex-col gap-6">
            <NewToolForm onCreated={loadTools} onError={handleError} />
            <ToolsList tools={tools} onChanged={loadTools} onError={handleError} />
          </div>
          <AccessPanel emails={emails} onChanged={loadEmails} onError={handleError} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Nueva herramienta ---------- */

/** Lee un trozo del archivo como base64 (sin el prefijo data:). */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function NewToolForm({
  onCreated,
  onError,
}: {
  onCreated: () => void;
  onError: (err: unknown, fallback: string) => void;
}) {
  const [mode, setMode] = useState<"file" | "link">("file");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [url, setUrl] = useState("");
  const [linkType, setLinkType] = useState<LinkType>("sheets");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      onError(null, `El archivo pesa ${formatBytes(f.size)}; el máximo es ${MAX_FILE_MB} MB.`);
      return;
    }
    setFile(f);
    // El nombre del archivo sirve de título si todavía no hay uno.
    if (!title.trim()) setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "));
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setFile(null);
    setProgress(null);
    setPublished(true);
    if (fileInput.current) fileInput.current.value = "";
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setNotice(null);
    setSaving(true);
    try {
      if (mode === "link") {
        await adminCreateLink({ data: { title, description, published, url, linkType } });
      } else {
        if (!file) throw new Error("Elige un archivo.");
        const uploadId = crypto.randomUUID();
        const totalParts = Math.max(1, Math.ceil(file.size / UPLOAD_PART_BYTES));
        setProgress(0);
        for (let index = 0; index < totalParts; index++) {
          const slice = file.slice(index * UPLOAD_PART_BYTES, (index + 1) * UPLOAD_PART_BYTES);
          await adminUploadPart({ data: { uploadId, index, base64: await blobToBase64(slice) } });
          setProgress(Math.round(((index + 1) / totalParts) * 100));
        }
        await adminFinishUpload({
          data: {
            uploadId,
            totalParts,
            title,
            description,
            published,
            fileName: file.name,
            mimeType: file.type,
          },
        });
      }
      setNotice(published ? "Herramienta publicada." : "Herramienta guardada como oculta.");
      reset();
      onCreated();
    } catch (err) {
      setProgress(null);
      onError(err, "No se pudo guardar la herramienta.");
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = title.trim().length >= 2 && (mode === "file" ? Boolean(file) : Boolean(url.trim()));

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Nueva herramienta</h2>
        <div className="flex gap-1 rounded-full border border-border p-1 text-xs">
          {(
            [
              ["file", "Subir archivo"],
              ["link", "Pegar enlace"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-full px-3 py-1.5 transition-colors ${
                mode === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
        {mode === "file" ? (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pickFile(e.dataTransfer.files[0]);
            }}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
              dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            }`}
          >
            <Upload className="size-6 text-primary" />
            {file ? (
              <>
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">{formatBytes(file.size)} · clic para cambiar</span>
              </>
            ) : (
              <>
                <span className="text-sm">Arrastra un archivo o haz clic para elegirlo</span>
                <span className="text-xs text-muted-foreground">PDF, Excel, Word, imágenes… hasta {MAX_FILE_MB} MB</span>
              </>
            )}
            <input
              ref={fileInput}
              type="file"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </button>
        ) : (
          <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tool-url" className={adminLabelClass}>
                Enlace
              </label>
              <input
                id="tool-url"
                type="url"
                placeholder="https://docs.google.com/spreadsheets/..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setLinkType(guessLinkType(e.target.value));
                }}
                className={adminInputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tool-type" className={adminLabelClass}>
                Tipo
              </label>
              <select
                id="tool-type"
                value={linkType}
                onChange={(e) => setLinkType(e.target.value as LinkType)}
                className={adminInputClass}
              >
                {LINK_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Recuerda compartir el documento de Google como “Cualquier persona con el enlace puede ver”
              o hacer una copia: el enlace en sí no da permisos.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="tool-title" className={adminLabelClass}>
            Título
          </label>
          <input
            id="tool-title"
            value={title}
            maxLength={120}
            placeholder="Plantilla de diario de trading"
            onChange={(e) => setTitle(e.target.value)}
            className={adminInputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tool-desc" className={adminLabelClass}>
            Descripción (opcional)
          </label>
          <textarea
            id="tool-desc"
            rows={2}
            maxLength={600}
            value={description}
            placeholder="Para qué sirve y cómo usarla."
            onChange={(e) => setDescription(e.target.value)}
            className={`${adminInputClass} h-auto py-2`}
          />
        </div>

        {progress !== null && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subiendo…</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground/80">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="size-4 accent-primary"
            />
            Publicar de inmediato
          </label>
          <button
            type="submit"
            disabled={!canSubmit || saving}
            className="h-10 rounded-md bg-primary px-5 text-xs font-semibold text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Guardando..." : "Guardar herramienta"}
          </button>
        </div>
        {notice && (
          <p role="status" className="text-sm text-primary">
            {notice}
          </p>
        )}
      </form>
    </section>
  );
}

/* ---------- Lista de herramientas ---------- */

function ToolsList({
  tools,
  onChanged,
  onError,
}: {
  tools: PublicTool[] | null;
  onChanged: () => void;
  onError: (err: unknown, fallback: string) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (id: string, action: () => Promise<unknown>, fallback: string) => {
    setBusy(id);
    try {
      await action();
      onChanged();
    } catch (err) {
      onError(err, fallback);
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Publicadas y ocultas</h2>
        {tools && <span className="text-xs text-muted-foreground">{tools.length} en total</span>}
      </div>
      {tools === null ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">Cargando...</p>
      ) : tools.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          Todavía no hay herramientas. Sube la primera arriba.
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {tools.map((tool) => {
            const { label, Icon } = toolMeta(tool);
            return (
              <li key={tool.id} className={`flex items-center gap-4 px-5 py-4 ${busy === tool.id ? "opacity-50" : ""}`}>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{tool.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {label}
                    {tool.size ? ` · ${formatBytes(tool.size)}` : ""} · {dateFormatter.format(new Date(tool.createdAt))}
                  </p>
                </div>
                <span
                  className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase sm:inline ${
                    tool.published ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {tool.published ? "Publicada" : "Oculta"}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <a
                    href={toolHref(tool)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir"
                    className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                  <button
                    type="button"
                    title={tool.published ? "Ocultar" : "Publicar"}
                    disabled={busy !== null}
                    onClick={() =>
                      run(
                        tool.id,
                        () => adminUpdateTool({ data: { id: tool.id, published: !tool.published } }),
                        "No se pudo cambiar la visibilidad.",
                      )
                    }
                    className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {tool.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                  <button
                    type="button"
                    title="Eliminar"
                    disabled={busy !== null}
                    onClick={() => {
                      if (!window.confirm(`¿Eliminar “${tool.title}”? Esta acción no se puede deshacer.`)) return;
                      void run(tool.id, () => adminDeleteTool({ data: { id: tool.id } }), "No se pudo eliminar.");
                    }}
                    className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* ---------- Correos autorizados ---------- */

function AccessPanel({
  emails,
  onChanged,
  onError,
}: {
  emails: AllowedEmail[] | null;
  onChanged: () => void;
  onError: (err: unknown, fallback: string) => void;
}) {
  const [raw, setRaw] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!emails || !q) return emails ?? [];
    return emails.filter((e) => `${e.email} ${e.note}`.toLowerCase().includes(q));
  }, [emails, query]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const result = await adminAddEmails({ data: { raw, note: note || undefined } });
      const parts = [`${result.added} agregado${result.added === 1 ? "" : "s"}`];
      if (result.existing) parts.push(`${result.existing} ya tenía${result.existing === 1 ? "" : "n"} acceso`);
      if (result.invalid.length) parts.push(`ignorados por inválidos: ${result.invalid.join(", ")}`);
      setNotice(parts.join(" · "));
      setRaw("");
      setNote("");
      onChanged();
    } catch (err) {
      onError(err, "No se pudieron agregar los correos.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (email: string) => {
    if (!window.confirm(`¿Quitar el acceso a ${email}? Perderá el acceso de inmediato.`)) return;
    try {
      await adminRemoveEmail({ data: { email } });
      onChanged();
    } catch (err) {
      onError(err, "No se pudo quitar el acceso.");
    }
  };

  return (
    <section className="flex min-w-0 flex-col rounded-xl border border-border bg-card lg:max-h-[calc(100dvh-10rem)] lg:sticky lg:top-6">
      <div className="border-b border-border p-5">
        <h2 className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Correos con acceso</h2>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
          <textarea
            rows={3}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={"Pega uno o varios correos\nseparados por comas o saltos de línea"}
            className={`${adminInputClass} h-auto py-2`}
          />
          <div className="flex gap-2">
            <input
              value={note}
              maxLength={120}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nota (opcional): nombre, cohorte…"
              className={`${adminInputClass} min-w-0 flex-1`}
            />
            <button
              type="submit"
              disabled={!raw.trim() || saving}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <UserPlus className="size-4" /> {saving ? "..." : "Dar acceso"}
            </button>
          </div>
          {notice && (
            <p role="status" className="text-xs text-primary">
              {notice}
            </p>
          )}
        </form>
      </div>

      <div className="flex items-center gap-3 border-b border-border px-5 py-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Buscar entre ${emails?.length ?? 0} correos`}
          className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <ul className="min-h-0 flex-1 divide-y divide-border/60 overflow-y-auto">
        {emails === null ? (
          <li className="px-5 py-8 text-center text-sm text-muted-foreground">Cargando...</li>
        ) : filtered.length === 0 ? (
          <li className="px-5 py-8 text-center text-sm text-muted-foreground">
            {emails.length === 0 ? "Nadie tiene acceso todavía." : "Ningún correo coincide."}
          </li>
        ) : (
          filtered.map((item) => (
            <li key={item.email} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.email}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.note ? `${item.note} · ` : ""}
                  {item.lastAccessAt
                    ? `Último ingreso ${dateFormatter.format(new Date(item.lastAccessAt))}`
                    : "Aún no ha entrado"}
                </p>
              </div>
              <button
                type="button"
                title="Quitar acceso"
                onClick={() => remove(item.email)}
                className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
