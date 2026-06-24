import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

function cleanEnv(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

export function isDatabaseConfigured() {
  return Boolean(cleanEnv(process.env.DATABASE_URL));
}

function shouldUseSsl() {
  return process.env.DATABASE_SSL === "true" || process.env.PGSSLMODE === "require";
}

export function getPostgresPool() {
  const connectionString = cleanEnv(process.env.DATABASE_URL);

  if (!connectionString) {
    throw new Error("Postgres order ledger is not configured. Set DATABASE_URL.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      ssl: shouldUseSsl() ? { rejectUnauthorized: false } : undefined,
    });
  }

  return pool;
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = [],
) {
  return getPostgresPool().query<T>(text, values);
}
