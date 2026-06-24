import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

function cleanEnv(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

function isRailwayRuntime() {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
      process.env.RAILWAY_ENVIRONMENT_ID ||
      process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_SERVICE_ID,
  );
}

function isRailwayInternalHost(hostname: string) {
  return hostname.endsWith(".railway.internal");
}

export function isDatabaseConfigured() {
  const connectionString = cleanEnv(process.env.DATABASE_URL);

  if (!connectionString) {
    return false;
  }

  try {
    const url = new URL(connectionString);

    if (isRailwayInternalHost(url.hostname) && !isRailwayRuntime()) {
      return false;
    }

    return (
      (url.protocol === "postgres:" || url.protocol === "postgresql:") &&
      Boolean(url.hostname && url.pathname.replace(/^\/+/, ""))
    );
  } catch {
    return false;
  }
}

function shouldUseSsl(connectionString: string) {
  if (process.env.DATABASE_SSL === "true" || process.env.PGSSLMODE === "require") {
    return true;
  }

  try {
    return new URL(connectionString).searchParams.get("sslmode") === "require";
  } catch {
    return false;
  }
}

export function getPostgresPool() {
  const connectionString = cleanEnv(process.env.DATABASE_URL);

  if (!connectionString) {
    throw new Error("Postgres order ledger is not configured. Set DATABASE_URL.");
  }

  if (!isDatabaseConfigured()) {
    throw new Error(
      "DATABASE_URL must be a valid postgres:// or postgresql:// connection string.",
    );
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
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
