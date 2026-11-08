import {
  File,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Link2,
  PlayCircle,
  Presentation,
} from "lucide-react";

import type { LinkType, PublicTool } from "./tools-api";

type Meta = { label: string; Icon: typeof File };

export const LINK_TYPE_OPTIONS: { value: LinkType; label: string; Icon: typeof File }[] = [
  { value: "sheets", label: "Google Sheets", Icon: FileSpreadsheet },
  { value: "docs", label: "Google Docs", Icon: FileText },
  { value: "slides", label: "Presentación", Icon: Presentation },
  { value: "drive", label: "Google Drive", Icon: FolderOpen },
  { value: "video", label: "Video", Icon: PlayCircle },
  { value: "otro", label: "Otro enlace", Icon: Link2 },
];

/** Etiqueta e ícono de una herramienta, según sea enlace o archivo. */
export function toolMeta(tool: PublicTool): Meta {
  if (tool.kind === "link") {
    const option = LINK_TYPE_OPTIONS.find((o) => o.value === tool.linkType);
    return option ? { label: option.label, Icon: option.Icon } : { label: "Enlace", Icon: Link2 };
  }
  const mime = tool.mimeType ?? "";
  const ext = tool.fileName?.split(".").pop()?.toUpperCase() ?? "Archivo";
  if (mime === "application/pdf") return { label: "PDF", Icon: FileText };
  if (/sheet|excel|csv/.test(mime)) return { label: ext, Icon: FileSpreadsheet };
  if (/presentation|powerpoint/.test(mime)) return { label: ext, Icon: Presentation };
  if (mime.startsWith("video/")) return { label: "Video", Icon: PlayCircle };
  return { label: ext, Icon: File };
}

export function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

export const toolHref = (tool: PublicTool) =>
  tool.kind === "link" ? (tool.url ?? "#") : `/herramientas/archivo/${tool.id}`;

/** Adivina el tipo de enlace por la URL, para preseleccionarlo en el formulario. */
export function guessLinkType(url: string): LinkType {
  if (/docs\.google\.com\/spreadsheets/.test(url)) return "sheets";
  if (/docs\.google\.com\/document/.test(url)) return "docs";
  if (/docs\.google\.com\/presentation/.test(url)) return "slides";
  if (/drive\.google\.com/.test(url)) return "drive";
  if (/youtube\.com|youtu\.be|vimeo\.com|loom\.com/.test(url)) return "video";
  return "otro";
}
