import { Binary, GridFSBucket, ObjectId, type Collection, type Db } from "mongodb";

import { getDb } from "./mongo";

/* ---------- Modelo ---------- */

export type ToolKind = "file" | "link";
export type LinkType = "sheets" | "docs" | "slides" | "drive" | "video" | "otro";

interface AllowedEmailDoc {
  email: string;
  /** Nombre o nota para reconocer al estudiante en el panel. */
  note?: string;
  createdAt: Date;
  lastAccessAt?: Date;
}

interface ToolDoc {
  title: string;
  description: string;
  kind: ToolKind;
  linkType?: LinkType;
  url?: string;
  fileId?: ObjectId;
  fileName?: string;
  mimeType?: string;
  size?: number;
  /** Solo las publicadas las ven los estudiantes. */
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Trozos temporales de una subida: Vercel limita cada petición a ~4,5 MB. */
interface UploadPartDoc {
  uploadId: string;
  index: number;
  data: Buffer;
  createdAt: Date;
}

export interface PublicTool {
  id: string;
  title: string;
  description: string;
  kind: ToolKind;
  linkType: LinkType | null;
  url: string | null;
  fileName: string | null;
  mimeType: string | null;
  size: number | null;
  published: boolean;
  createdAt: string;
}

export interface AllowedEmail {
  email: string;
  note: string;
  createdAt: string;
  lastAccessAt: string | null;
}

export const MAX_FILE_BYTES = 25 * 1024 * 1024;

let indexesReady: Promise<unknown> | null = null;

async function db(): Promise<Db> {
  const database = await getDb();
  indexesReady ??= Promise.all([
    database.collection("student_access").createIndex({ email: 1 }, { unique: true }),
    database.collection("tools").createIndex({ createdAt: -1 }),
    database.collection("tool_upload_parts").createIndex({ uploadId: 1, index: 1 }, { unique: true }),
    // Las subidas abandonadas se limpian solas a las 24 h.
    database
      .collection("tool_upload_parts")
      .createIndex({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 }),
  ]).catch((error) => {
    indexesReady = null;
    throw error;
  });
  await indexesReady;
  return database;
}

const access = async (): Promise<Collection<AllowedEmailDoc>> =>
  (await db()).collection<AllowedEmailDoc>("student_access");
const tools = async (): Promise<Collection<ToolDoc>> => (await db()).collection<ToolDoc>("tools");
const parts = async (): Promise<Collection<UploadPartDoc>> =>
  (await db()).collection<UploadPartDoc>("tool_upload_parts");
const bucket = async () => new GridFSBucket(await db(), { bucketName: "tool_files" });

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

/* ---------- Correos autorizados ---------- */

export async function isEmailAllowed(email: string): Promise<boolean> {
  return (await (await access()).countDocuments({ email: normalizeEmail(email) }, { limit: 1 })) > 0;
}

export async function touchAccess(email: string) {
  await (await access()).updateOne(
    { email: normalizeEmail(email) },
    { $set: { lastAccessAt: new Date() } },
  );
}

export async function listAllowedEmails(): Promise<AllowedEmail[]> {
  const docs = await (await access()).find().sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({
    email: d.email,
    note: d.note ?? "",
    createdAt: d.createdAt.toISOString(),
    lastAccessAt: d.lastAccessAt ? d.lastAccessAt.toISOString() : null,
  }));
}

/** Agrega varios correos de una vez; los que ya estaban se ignoran. */
export async function addAllowedEmails(emails: string[], note?: string) {
  const unique = [...new Set(emails.map(normalizeEmail))];
  if (unique.length === 0) return { added: 0, existing: 0 };
  const result = await (await access()).bulkWrite(
    unique.map((email) => ({
      updateOne: {
        filter: { email },
        update: { $setOnInsert: { email, createdAt: new Date(), ...(note ? { note } : {}) } },
        upsert: true,
      },
    })),
    { ordered: false },
  );
  return { added: result.upsertedCount, existing: unique.length - result.upsertedCount };
}

export async function removeAllowedEmail(email: string) {
  await (await access()).deleteOne({ email: normalizeEmail(email) });
}

/* ---------- Herramientas ---------- */

function toPublic(doc: ToolDoc & { _id: ObjectId }): PublicTool {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    description: doc.description,
    kind: doc.kind,
    linkType: doc.linkType ?? null,
    url: doc.url ?? null,
    fileName: doc.fileName ?? null,
    mimeType: doc.mimeType ?? null,
    size: doc.size ?? null,
    published: doc.published,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function listTools(onlyPublished: boolean): Promise<PublicTool[]> {
  const docs = await (await tools())
    .find(onlyPublished ? { published: true } : {})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toPublic);
}

export async function createLinkTool(input: {
  title: string;
  description: string;
  url: string;
  linkType: LinkType;
  published: boolean;
}) {
  const now = new Date();
  await (await tools()).insertOne({
    ...input,
    kind: "link",
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateTool(
  id: string,
  changes: Partial<Pick<ToolDoc, "title" | "description" | "published" | "url" | "linkType">>,
) {
  await (await tools()).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...changes, updatedAt: new Date() } },
  );
}

export async function deleteTool(id: string) {
  const col = await tools();
  const doc = await col.findOneAndDelete({ _id: new ObjectId(id) });
  if (doc?.fileId) {
    await (await bucket()).delete(doc.fileId).catch(() => undefined);
  }
}

/* ---------- Subida de archivos por partes ---------- */

export async function saveUploadPart(uploadId: string, index: number, data: Buffer) {
  await (await parts()).updateOne(
    { uploadId, index },
    { $set: { data, createdAt: new Date() } },
    { upsert: true },
  );
}

/**
 * Une las partes en GridFS y crea la herramienta. Se valida que lleguen
 * todas, en orden, y que el total no pase del límite.
 */
export async function finishUpload(input: {
  uploadId: string;
  totalParts: number;
  title: string;
  description: string;
  fileName: string;
  mimeType: string;
  published: boolean;
}) {
  const partsCol = await parts();
  const chunks = await partsCol
    .find({ uploadId: input.uploadId })
    .sort({ index: 1 })
    .toArray();

  if (chunks.length !== input.totalParts || chunks.some((c, i) => c.index !== i)) {
    throw new Error("La subida llegó incompleta. Inténtalo de nuevo.");
  }
  // Mongo devuelve los binarios como `Binary`; se copian sus bytes exactos.
  const buffers = chunks.map((c) => {
    const raw = c.data as unknown;
    return raw instanceof Binary ? Buffer.from(raw.buffer) : Buffer.from(raw as Buffer);
  });
  const size = buffers.reduce((sum, b) => sum + b.length, 0);
  if (size > MAX_FILE_BYTES) throw new Error("El archivo supera el máximo de 25 MB.");

  const gridfs = await bucket();
  const fileId = await new Promise<ObjectId>((resolve, reject) => {
    const stream = gridfs.openUploadStream(input.fileName, {
      metadata: { mimeType: input.mimeType },
    });
    stream.on("error", reject);
    stream.on("finish", () => resolve(stream.id as ObjectId));
    stream.end(Buffer.concat(buffers));
  });

  const now = new Date();
  await (await tools()).insertOne({
    title: input.title,
    description: input.description,
    kind: "file",
    fileId,
    fileName: input.fileName,
    mimeType: input.mimeType,
    size,
    published: input.published,
    createdAt: now,
    updatedAt: now,
  });
  await partsCol.deleteMany({ uploadId: input.uploadId });
}

/** El archivo de una herramienta, para descargarlo (solo si está publicada o lo pide el admin). */
export async function openToolFile(id: string, includeUnpublished: boolean) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await (await tools()).findOne({
    _id: new ObjectId(id),
    kind: "file",
    ...(includeUnpublished ? {} : { published: true }),
  });
  if (!doc?.fileId) return null;
  return {
    fileName: doc.fileName ?? "archivo",
    mimeType: doc.mimeType ?? "application/octet-stream",
    size: doc.size ?? 0,
    stream: (await bucket()).openDownloadStream(doc.fileId),
  };
}
