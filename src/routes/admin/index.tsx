import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Fragment, useCallback, useEffect, useState } from "react";

import { AdminHeader } from "@/components/admin/admin-header";
import {
  adminInputClass,
  adminLabelClass,
  EventoConfigPanel,
} from "@/components/admin/evento-config-panel";
import {
  fetchCampaigns,
  fetchCampanas,
  fetchLeads,
  fetchStats,
  fetchWhatsappGroups,
  getAdminSession,
  isUnauthorized,
  NO_CAMPAIGN,
  NO_CAMPANA,
  NO_GROUP,
  type AdminLead,
  type CampaignSummary,
  type CampanaSummary,
  type LeadFilters,
  type LeadSort,
  type WhatsappGroupSummary,
} from "@/lib/admin-api";
import {
  countryName,
  dateFormatter,
  EXPORT_COLUMNS as COLUMNS,
  originOf,
  STAGE_LABELS,
  UTM_KEYS,
} from "@/lib/admin-leads";
import type { LeadStage } from "@/lib/funnel-api";
import { downloadLeadsCsv, downloadLeadsPdf, downloadLeadsXlsx } from "@/lib/leads-export";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { authenticated } = await getAdminSession();
    if (!authenticated) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [{ title: "Leads — BTM Academy" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminDashboardPage,
});

type ExportFormat = "csv" | "xlsx" | "pdf";
type PageLimit = 25 | 50 | 100 | "all";

const STAGE_ORDER: LeadStage[] = ["captured", "progress_viewed", "whatsapp_joined", "registered"];

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<PageLimit>(25);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  /** Cuántos llegaron sin UTM; 0 esconde la opción "Orgánico". */
  const [campaignsWithout, setCampaignsWithout] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campanas, setCampanas] = useState<CampanaSummary[]>([]);
  const [campanasWithout, setCampanasWithout] = useState(0);
  const [selectedCampana, setSelectedCampana] = useState("");
  /** Se sube al guardar la configuración del evento para recargar las listas. */
  const [configVersion, setConfigVersion] = useState(0);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [onlyReturning, setOnlyReturning] = useState(false);
  const [groups, setGroups] = useState<WhatsappGroupSummary[]>([]);
  const [groupsWithout, setGroupsWithout] = useState(0);
  /*
    `undefined` = todavía no sabemos cuál es el grupo activo, así que aún no se
    piden leads: evita cargar la lista completa y luego reemplazarla por la
    filtrada. `""` = todos los grupos.
  */
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<LeadSort>("recent");
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchStats>> | null>(null);

  const hasActiveFilter =
    selectedCampaign !== "" ||
    selectedCampana !== "" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    onlyReturning ||
    Boolean(selectedGroup);

  const handleUnauthorized = useCallback(() => {
    void navigate({ to: "/admin/login", replace: true });
  }, [navigate]);

  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setError(err instanceof Error && err.message ? err.message : fallback);
    },
    [handleUnauthorized],
  );

  const baseFilters = (): LeadFilters => ({
    campaign: selectedCampaign,
    campana: selectedCampana,
    whatsappGroup: selectedGroup ?? "",
    dateFrom,
    dateTo,
    onlyReturning,
  });

  /* Conteos por campaña de anuncios, dentro del resto de filtros activos. */
  useEffect(() => {
    if (selectedGroup === undefined) return;
    fetchCampaigns({
      data: { campana: selectedCampana, whatsappGroup: selectedGroup, dateFrom, dateTo, onlyReturning },
    })
      .then(({ items, withoutCampaign }) => {
        setCampaigns(items);
        setCampaignsWithout(withoutCampaign);
      })
      .catch((err: unknown) => {
        if (isUnauthorized(err)) handleUnauthorized();
        // Si falla, el filtro queda sin opciones; el tablero sigue sirviendo.
        else setCampaigns([]);
      });
  }, [selectedGroup, selectedCampana, dateFrom, dateTo, onlyReturning, handleUnauthorized]);

  useEffect(() => {
    fetchCampanas()
      .then(({ items, withoutCampana }) => {
        setCampanas(items);
        setCampanasWithout(withoutCampana);
      })
      .catch(() => setCampanas([]));
  }, [configVersion]);

  useEffect(() => {
    fetchWhatsappGroups()
      .then(({ items, withoutGroup, active }) => {
        setGroups(items);
        setGroupsWithout(withoutGroup);
        // El grupo vigente es el de la convocatoria en curso: arranca filtrado
        // por él (solo la primera vez). Sin grupo configurado, se muestran todos.
        setSelectedGroup((actual) => (actual === undefined ? (active?.code ?? "") : actual));
      })
      .catch((err: unknown) => {
        if (isUnauthorized(err)) handleUnauthorized();
        else setSelectedGroup((actual) => actual ?? "");
      });
  }, [configVersion, handleUnauthorized]);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => undefined);
  }, [configVersion]);

  useEffect(() => {
    if (selectedGroup === undefined) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchLeads({
      data: {
        filters: baseFilters(),
        sort,
        page,
        limit: limit === "all" ? null : limit,
      },
    })
      .then((data) => {
        if (cancelled) return;
        setLeads(data.items);
        setTotal(data.total);
      })
      .catch((err: unknown) => {
        if (!cancelled) handleError(err, "No se pudieron cargar los leads.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // baseFilters se arma con estos mismos valores.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, selectedCampaign, selectedCampana, selectedGroup, dateFrom, dateTo, onlyReturning, sort, configVersion, handleError]);

  /** Cualquier cambio de filtro vuelve a la página 1. */
  const withReset =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  const handleClearFilters = () => {
    setSelectedCampaign("");
    setSelectedCampana("");
    setDateFrom("");
    setDateTo("");
    setOnlyReturning(false);
    setSelectedGroup("");
    setPage(1);
  };

  const handleExport = async (format: ExportFormat) => {
    if (exportingFormat) return;
    setExportingFormat(format);
    setError(null);

    try {
      const { items } = await fetchLeads({
        data: { filters: baseFilters(), sort, page: 1, limit: null },
      });
      if (format === "csv") downloadLeadsCsv(items);
      else if (format === "pdf") await downloadLeadsPdf(items);
      else await downloadLeadsXlsx(items);
    } catch (err) {
      handleError(err, "No se pudo generar el archivo. Inténtalo de nuevo.");
    } finally {
      setExportingFormat(null);
    }
  };

  const totalPages = limit === "all" ? 1 : Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-dvh bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Leads del embudo</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {total} lead{total === 1 ? "" : "s"}
              {hasActiveFilter ? " con los filtros aplicados" : " capturados en total"}
              {hasActiveFilter && stats ? ` (de ${stats.total} en total)` : ""}.
            </p>
            {stats && stats.returning > 0 && (
              <button
                type="button"
                onClick={() => {
                  setOnlyReturning(true);
                  setSort("submissions");
                  setPage(1);
                }}
                className="mt-1 text-sm text-primary underline-offset-4 hover:underline"
              >
                {stats.returning} se {stats.returning === 1 ? "registró" : "registraron"} más de una
                vez →
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {(["csv", "xlsx", "pdf"] as const).map((format) => (
              <button
                key={format}
                type="button"
                disabled={exportingFormat !== null}
                onClick={() => handleExport(format)}
                className="rounded-md border border-primary/40 px-4 py-2 text-xs font-semibold text-primary uppercase transition-colors hover:border-primary hover:bg-primary/10 disabled:opacity-40"
              >
                {exportingFormat === format ? "Generando..." : `Exportar ${format.toUpperCase()}`}
              </button>
            ))}
          </div>
        </div>

        {/* Embudo: cuántos leads hay en cada etapa (sin filtros). */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STAGE_ORDER.map((stage) => (
              <div key={stage} className="rounded-xl border border-border bg-card px-4 py-3">
                <p className={adminLabelClass}>{STAGE_LABELS[stage]}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{stats.byStage[stage]}</p>
              </div>
            ))}
          </div>
        )}

        <EventoConfigPanel
          onSaved={() => setConfigVersion((v) => v + 1)}
          onUnauthorized={handleUnauthorized}
        />

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="campana-filter" className={adminLabelClass}>
              Convocatoria
            </label>
            <select
              id="campana-filter"
              value={selectedCampana}
              onChange={(e) => withReset(setSelectedCampana)(e.target.value)}
              className={`${adminInputClass} min-w-[12rem]`}
            >
              <option value="">Todas</option>
              {campanas.map((item) => (
                <option key={item.campana} value={item.campana}>
                  {item.campana} ({item.count})
                </option>
              ))}
              {campanasWithout > 0 && (
                <option value={NO_CAMPANA}>Sin convocatoria ({campanasWithout})</option>
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="group-filter" className={adminLabelClass}>
              Grupo de WhatsApp
            </label>
            <select
              id="group-filter"
              value={selectedGroup ?? ""}
              onChange={(e) => withReset(setSelectedGroup)(e.target.value)}
              className={`${adminInputClass} min-w-[14rem]`}
            >
              <option value="">Todos los grupos</option>
              {groups.map((group) => (
                <option key={group.code} value={group.code}>
                  {group.label} ({group.count})
                </option>
              ))}
              {groupsWithout > 0 && <option value={NO_GROUP}>Sin grupo ({groupsWithout})</option>}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="campaign-filter" className={adminLabelClass}>
              Campaña de anuncios
            </label>
            <select
              id="campaign-filter"
              value={selectedCampaign}
              onChange={(e) => withReset(setSelectedCampaign)(e.target.value)}
              className={adminInputClass}
            >
              <option value="">Todas (utm_campaign)</option>
              {campaigns.map((item) => (
                <option key={item.campaign} value={item.campaign}>
                  {item.campaign} ({item.count})
                </option>
              ))}
              {/*
                Los conteos dependen de los demás filtros: la campaña elegida
                puede quedar en cero y salir de la lista. Se mantiene para que
                el <select> no aparente que no hay filtro cuando sí lo hay.
              */}
              {selectedCampaign !== "" &&
                selectedCampaign !== NO_CAMPAIGN &&
                !campaigns.some((item) => item.campaign === selectedCampaign) && (
                  <option value={selectedCampaign}>{selectedCampaign} (0)</option>
                )}
              {(campaignsWithout > 0 || selectedCampaign === NO_CAMPAIGN) && (
                <option value={NO_CAMPAIGN}>Orgánico / sin UTM ({campaignsWithout})</option>
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="date-from" className={adminLabelClass}>
              Desde
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => withReset(setDateFrom)(e.target.value)}
              className={adminInputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="date-to" className={adminLabelClass}>
              Hasta
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => withReset(setDateTo)(e.target.value)}
              className={adminInputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sort-order" className={adminLabelClass}>
              Ordenar por
            </label>
            <select
              id="sort-order"
              value={sort}
              onChange={(e) =>
                withReset(setSort)(e.target.value === "submissions" ? "submissions" : "recent")
              }
              className={adminInputClass}
            >
              <option value="recent">Más recientes</option>
              <option value="submissions">Más inscripciones</option>
            </select>
          </div>

          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-border px-4 text-sm text-foreground/80 transition-colors hover:border-muted-foreground/40">
            <input
              type="checkbox"
              checked={onlyReturning}
              onChange={(e) => withReset(setOnlyReturning)(e.target.checked)}
              className="size-4 accent-primary"
            />
            Solo reinscritos
          </label>

          <button
            type="button"
            onClick={handleClearFilters}
            className="h-10 rounded-md border border-border px-4 text-xs font-semibold text-muted-foreground uppercase transition-colors hover:border-muted-foreground/40 hover:text-foreground"
          >
            Limpiar filtros
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[1560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-xs font-semibold tracking-[0.08em] whitespace-nowrap text-primary uppercase"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    Cargando leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    {error
                      ? "No se pudieron cargar los leads (revisa la conexión con la base de datos)."
                      : hasActiveFilter
                        ? "Ningún lead coincide con los filtros."
                        : "Todavía no hay leads."}
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const isReturning = lead.submission_count > 1;
                  const isExpanded = expandedLeadId === lead.id;
                  const cell = "px-4 py-3 text-sm whitespace-nowrap";

                  return (
                    <Fragment key={lead.id}>
                      <tr className="border-b border-border/50 last:border-0 hover:bg-secondary/40">
                        <td className={`${cell} text-foreground/80`}>
                          {dateFormatter.format(new Date(lead.created_at))}
                        </td>
                        <td className={`${cell} text-foreground/80`}>{lead.campana ?? "—"}</td>
                        <td className={`${cell} text-muted-foreground`}>
                          {lead.whatsapp_group_label ?? "—"}
                        </td>
                        <td className={`${cell} text-foreground/80`}>{STAGE_LABELS[lead.stage]}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                            aria-expanded={isExpanded}
                            title="Ver el detalle de cada inscripción"
                            className={`flex min-w-9 items-center justify-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                              isReturning
                                ? "bg-primary text-primary-foreground hover:opacity-90"
                                : "border border-border text-foreground/70 hover:border-muted-foreground/50"
                            }`}
                          >
                            {lead.submission_count}
                            <span aria-hidden className="text-[9px]">
                              {isExpanded ? "▲" : "▼"}
                            </span>
                          </button>
                        </td>
                        <td className={`${cell} text-foreground/80`}>
                          {dateFormatter.format(new Date(lead.last_submitted_at))}
                        </td>
                        <td className={cell}>{lead.first_name}</td>
                        <td className={cell}>{lead.last_name}</td>
                        <td className={`${cell} text-foreground/80`}>{lead.email}</td>
                        <td className={`${cell} text-foreground/80`}>
                          {lead.dial_code} {lead.phone_number}
                        </td>
                        <td className={`${cell} text-foreground/80`}>
                          {countryName(lead.country_code)}
                        </td>
                        <td className={`${cell} text-foreground/80`}>{originOf(lead)}</td>
                        {UTM_KEYS.map((key) => {
                          const value = lead.tracking?.[key];
                          return (
                            <td key={key} className="px-4 py-3 text-sm text-muted-foreground">
                              {/* Los UTM de Meta traen valores muy largos: se recortan. */}
                              <span title={value} className="block max-w-[18ch] truncate">
                                {value ?? "—"}
                              </span>
                            </td>
                          );
                        })}
                      </tr>

                      {isExpanded && (
                        <tr className="border-b border-border/50 bg-background/60">
                          <td colSpan={COLUMNS.length} className="px-4 py-4">
                            <p className="text-xs tracking-[0.18em] text-primary uppercase">
                              Historial de inscripciones
                            </p>
                            <ol className="mt-3 flex flex-col gap-2">
                              {lead.submissions.map((submission, index) => (
                                <li
                                  key={`${submission.at}-${index}`}
                                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-l-2 border-primary/40 pl-3 text-sm text-foreground/75"
                                >
                                  <span className="text-xs text-primary">#{index + 1}</span>
                                  <span className="whitespace-nowrap">
                                    {dateFormatter.format(new Date(submission.at))}
                                  </span>
                                  {submission.phone_e164 && (
                                    <span className="text-muted-foreground">
                                      {submission.phone_e164}
                                    </span>
                                  )}
                                  <span className="text-muted-foreground">
                                    {submission.tracking?.utm_campaign ?? "sin campaña de anuncios"}
                                  </span>
                                  {submission.campana && (
                                    <span className="rounded-full bg-primary/15 px-2 text-xs text-primary">
                                      {submission.campana}
                                    </span>
                                  )}
                                  {submission.whatsapp_group_label && (
                                    <span className="rounded-full border border-primary/30 px-2 text-xs text-primary">
                                      {submission.whatsapp_group_label}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ol>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <select
              value={limit}
              onChange={(e) =>
                withReset(setLimit)(
                  e.target.value === "all" ? "all" : (Number(e.target.value) as PageLimit),
                )
              }
              className="h-9 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-primary/60"
            >
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
              <option value="all">Todos</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-md border border-border px-4 py-2 text-xs font-semibold uppercase transition-colors hover:border-muted-foreground/40 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-md border border-border px-4 py-2 text-xs font-semibold uppercase transition-colors hover:border-muted-foreground/40 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
