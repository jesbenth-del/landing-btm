import { MongoClient, type Db } from "mongodb";

/**
 * Cliente de MongoDB compartido. En serverless (Vercel) cada instancia
 * reutiliza la conexión entre peticiones, y en desarrollo se guarda en
 * `globalThis` para que la recarga en caliente no abra conexiones nuevas.
 */
const globalForMongo = globalThis as unknown as {
  __btmMongo?: { client: MongoClient; ready: Promise<Db> };
};

async function ensureIndexes(db: Db) {
  const leads = db.collection("leads");
  await Promise.all([
    // El correo identifica al lead: un correo, una ficha.
    leads.createIndex({ email: 1 }, { unique: true }),
    leads.createIndex({ createdAt: -1 }),
    leads.createIndex({ stage: 1 }),
    leads.createIndex({ "tracking.utm_campaign": 1 }),
    // Sostienen los filtros por grupo y convocatoria (se buscan en el historial).
    leads.createIndex({ "submissions.whatsappGroup.code": 1 }),
    leads.createIndex({ "submissions.campana": 1 }),
  ]);
}

export function getDb(): Promise<Db> {
  if (!globalForMongo.__btmMongo) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Falta la variable MONGODB_URI");

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    });
    const ready = client.connect().then(async () => {
      const db = client.db(process.env.MONGODB_DB || "btm_academy");
      await ensureIndexes(db);
      return db;
    });
    // Si la conexión falla, se olvida para reintentar en la siguiente petición.
    ready.catch(() => {
      globalForMongo.__btmMongo = undefined;
    });
    globalForMongo.__btmMongo = { client, ready };
  }
  return globalForMongo.__btmMongo.ready;
}
