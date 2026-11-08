import { buildLeadsXlsx, type AdminLead } from "./admin-api";
import { EXPORT_COLUMNS, toExportRow } from "./admin-leads";

const todayStamp = () => new Date().toISOString().slice(0, 10);

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toCsvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Sin librería: el CSV es texto plano. */
export function downloadLeadsCsv(leads: AdminLead[]) {
  const lines = [
    EXPORT_COLUMNS.map(toCsvCell).join(","),
    ...leads.map((lead) => toExportRow(lead).map(toCsvCell).join(",")),
  ];
  // El BOM es para que Excel abra los acentos como UTF-8, no como Latin-1.
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `leads-${todayStamp()}.csv`);
}

/** El .xlsx se arma en el servidor (exceljs); aquí solo se manda la data y se descarga. */
export async function downloadLeadsXlsx(leads: AdminLead[]) {
  const { base64 } = await buildLeadsXlsx({
    data: { columns: EXPORT_COLUMNS, rows: leads.map(toExportRow) },
  });
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, `leads-${todayStamp()}.xlsx`);
}

/** jsPDF se carga solo al exportar: no pesa en el resto del panel. */
export async function downloadLeadsPdf(leads: AdminLead[]) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const doc = new jsPDF({ orientation: "landscape" });
  autoTable(doc, {
    head: [EXPORT_COLUMNS],
    body: leads.map(toExportRow),
    styles: { fontSize: 6 },
    // Verde lima de la marca (#DCEB1A) con texto negro.
    headStyles: { fillColor: [220, 235, 26], textColor: [10, 10, 10] },
  });
  doc.save(`leads-${todayStamp()}.pdf`);
}
