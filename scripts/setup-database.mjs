import fs from "node:fs";
import { Pool } from "pg";

function loadDotEnv() {
  if (!fs.existsSync(".env")) {
    return;
  }

  const lines = fs.readFileSync(".env", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    process.env[key] ??= value;
  }
}

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL?.trim();

  if (!value) {
    throw new Error("DATABASE_URL is not set.");
  }

  const url = new URL(value);

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must use postgres:// or postgresql://.");
  }

  return { connectionString: value, url };
}

function shouldUseSsl(connectionString) {
  if (process.env.DATABASE_SSL === "true" || process.env.PGSSLMODE === "require") {
    return true;
  }

  return new URL(connectionString).searchParams.get("sslmode") === "require";
}

function describeDatabase(url) {
  return {
    host: url.hostname,
    port: url.port || "5432",
    database: url.pathname.replace(/^\/+/, ""),
    railwayInternal: url.hostname.endsWith(".railway.internal"),
  };
}

const statements = [
  `
    create table if not exists commerce_orders (
      external_order_id text primary key,
      clerk_user_id text,
      status text not null default 'payment_pending',
      customer_email text not null,
      customer_first_name text not null,
      customer_last_name text not null,
      customer_phone text,
      shipping_address jsonb not null,
      items jsonb not null,
      attestation_accepted boolean not null default false,
      amount_cents integer not null,
      payment_provider text,
      payment_transaction_id text,
      payment_auth_code text,
      payment_event_type text,
      payment_notification_id text,
      vial_order_id text,
      vial_status text,
      tracking jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      paid_at timestamptz,
      submitted_to_vial_at timestamptz
    )
  `,
  `
    alter table commerce_orders
    add column if not exists clerk_user_id text
  `,
  `
    create table if not exists payment_events (
      notification_id text primary key,
      external_order_id text,
      event_type text,
      transaction_id text,
      response_code text,
      payload jsonb not null,
      received_at timestamptz not null default now()
    )
  `,
  `
    create table if not exists fulfillment_events (
      delivery_id text primary key,
      external_order_id text,
      event_type text,
      vialapi_order_id text,
      status text,
      tracking jsonb,
      payload jsonb not null,
      received_at timestamptz not null default now()
    )
  `,
  "create index if not exists commerce_orders_customer_email_idx on commerce_orders (customer_email)",
  "create index if not exists commerce_orders_clerk_user_id_idx on commerce_orders (clerk_user_id)",
  "create index if not exists commerce_orders_payment_transaction_idx on commerce_orders (payment_transaction_id)",
  `
    create table if not exists catalog_product_overrides (
      sku text primary key,
      product_name text,
      product_slug text,
      stock_status text,
      primary_image_file uuid,
      secondary_image_file uuid,
      tertiary_image_file uuid,
      price_dollars numeric(10, 2),
      cost_dollars numeric(10, 2),
      price_cents integer,
      cost_cents integer,
      category text,
      size_label text,
      short_description text,
      research_overview text,
      purity_label text,
      storage_label text,
      molecular_weight text,
      sequence text,
      tags text[],
      images text[],
      technical_specs jsonb,
      is_featured boolean not null default false,
      is_hidden boolean not null default false,
      notes text,
      updated_by text,
      vial_last_synced_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `,
  `
    alter table catalog_product_overrides
    add column if not exists product_name text,
    add column if not exists product_slug text,
    add column if not exists stock_status text,
    add column if not exists vial_last_synced_at timestamptz,
    add column if not exists primary_image_file uuid,
    add column if not exists secondary_image_file uuid,
    add column if not exists tertiary_image_file uuid,
    add column if not exists price_dollars numeric(10, 2),
    add column if not exists cost_dollars numeric(10, 2),
    add column if not exists cost_cents integer,
    add column if not exists is_featured boolean not null default false,
    add column if not exists is_hidden boolean not null default false,
    add column if not exists notes text,
    add column if not exists updated_by text,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now()
  `,
  `
    create table if not exists catalog_product_images (
      id bigserial primary key,
      sku text not null references catalog_product_overrides(sku) on delete cascade,
      image_url text not null,
      alt_text text,
      sort_order integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `,
  "create index if not exists catalog_product_images_sku_idx on catalog_product_images (sku, sort_order, id)",
  "create unique index if not exists catalog_product_images_sku_url_idx on catalog_product_images (sku, image_url)",
  `
    update catalog_product_overrides
    set price_dollars = round(price_cents::numeric / 100, 2)
    where price_dollars is null
      and price_cents is not null
  `,
  `
    update catalog_product_overrides
    set cost_dollars = round(cost_cents::numeric / 100, 2)
    where cost_dollars is null
      and cost_cents is not null
  `,
];

async function main() {
  loadDotEnv();

  const { connectionString, url } = getDatabaseUrl();
  const database = describeDatabase(url);
  const pool = new Pool({
    connectionString,
    max: 1,
    ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
  });

  console.log("Setting up Postgres schema", database);

  try {
    for (const statement of statements) {
      await pool.query(statement);
    }

    const result = await pool.query(`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_name = any($1::text[])
      order by table_name
    `, [[
      "catalog_product_images",
      "catalog_product_overrides",
      "commerce_orders",
      "fulfillment_events",
      "payment_events",
    ]]);

    console.log("Database setup complete", {
      tables: result.rows.map((row) => row.table_name),
    });
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Database setup failed", {
    message: error instanceof Error ? error.message : "Unknown database error",
  });
  process.exitCode = 1;
});
