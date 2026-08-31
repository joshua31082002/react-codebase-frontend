import "server-only";
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://revolte:revolte@127.0.0.1:5432/atelier";

const client =
  globalForDb.client ??
  postgres(databaseUrl, {
    ssl: false,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
export { schema, client };
