export async function up(knex) {
  const hasCommerceOrders = await knex.schema.hasTable("commerce_orders");

  if (!hasCommerceOrders) {
    await knex.schema.createTable("commerce_orders", (table) => {
      table.text("external_order_id").primary();
      table.text("clerk_user_id");
      table.text("status").notNullable().defaultTo("payment_pending");
      table.text("customer_email").notNullable();
      table.text("customer_first_name").notNullable();
      table.text("customer_last_name").notNullable();
      table.text("customer_phone");
      table.jsonb("shipping_address").notNullable();
      table.jsonb("items").notNullable();
      table.boolean("attestation_accepted").notNullable().defaultTo(false);
      table.integer("amount_cents").notNullable();
      table.text("payment_provider");
      table.text("payment_transaction_id");
      table.text("payment_auth_code");
      table.text("payment_event_type");
      table.text("payment_notification_id");
      table.text("vial_order_id");
      table.text("vial_status");
      table.jsonb("tracking");
      table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
      table.timestamp("paid_at", { useTz: true });
      table.timestamp("submitted_to_vial_at", { useTz: true });
    });
  }

  await addColumnIfMissing(knex, "commerce_orders", "clerk_user_id", (table) =>
    table.text("clerk_user_id"),
  );

  const hasPaymentEvents = await knex.schema.hasTable("payment_events");

  if (!hasPaymentEvents) {
    await knex.schema.createTable("payment_events", (table) => {
      table.text("notification_id").primary();
      table.text("external_order_id");
      table.text("event_type");
      table.text("transaction_id");
      table.text("response_code");
      table.jsonb("payload").notNullable();
      table.timestamp("received_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
  }

  const hasFulfillmentEvents = await knex.schema.hasTable("fulfillment_events");

  if (!hasFulfillmentEvents) {
    await knex.schema.createTable("fulfillment_events", (table) => {
      table.text("delivery_id").primary();
      table.text("external_order_id");
      table.text("event_type");
      table.text("vialapi_order_id");
      table.text("status");
      table.jsonb("tracking");
      table.jsonb("payload").notNullable();
      table.timestamp("received_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
  }

  await knex.schema.raw(
    "create index if not exists commerce_orders_customer_email_idx on commerce_orders (customer_email)",
  );
  await knex.schema.raw(
    "create index if not exists commerce_orders_clerk_user_id_idx on commerce_orders (clerk_user_id)",
  );
  await knex.schema.raw(
    "create index if not exists commerce_orders_payment_transaction_idx on commerce_orders (payment_transaction_id)",
  );

  const hasCatalogOverrides = await knex.schema.hasTable("catalog_product_overrides");

  if (!hasCatalogOverrides) {
    await knex.schema.createTable("catalog_product_overrides", (table) => {
      table.text("sku").primary();
      table.integer("price_cents");
      table.integer("cost_cents");
      table.text("category");
      table.text("size_label");
      table.text("short_description");
      table.text("research_overview");
      table.text("purity_label");
      table.text("storage_label");
      table.text("molecular_weight");
      table.text("sequence");
      table.specificType("tags", "text[]");
      table.specificType("images", "text[]");
      table.jsonb("technical_specs");
      table.boolean("is_featured").notNullable().defaultTo(false);
      table.boolean("is_hidden").notNullable().defaultTo(false);
      table.text("notes");
      table.text("updated_by");
      table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
  }

  await addColumnIfMissing(knex, "catalog_product_overrides", "cost_cents", (table) =>
    table.integer("cost_cents"),
  );
  await addColumnIfMissing(knex, "catalog_product_overrides", "is_featured", (table) =>
    table.boolean("is_featured").notNullable().defaultTo(false),
  );
  await addColumnIfMissing(knex, "catalog_product_overrides", "is_hidden", (table) =>
    table.boolean("is_hidden").notNullable().defaultTo(false),
  );
  await addColumnIfMissing(knex, "catalog_product_overrides", "notes", (table) =>
    table.text("notes"),
  );
  await addColumnIfMissing(knex, "catalog_product_overrides", "updated_by", (table) =>
    table.text("updated_by"),
  );
  await addColumnIfMissing(knex, "catalog_product_overrides", "created_at", (table) =>
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now()),
  );
  await addColumnIfMissing(knex, "catalog_product_overrides", "updated_at", (table) =>
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now()),
  );

  const hasCatalogImages = await knex.schema.hasTable("catalog_product_images");

  if (!hasCatalogImages) {
    await knex.schema.createTable("catalog_product_images", (table) => {
      table.bigIncrements("id").primary();
      table
        .text("sku")
        .notNullable()
        .references("sku")
        .inTable("catalog_product_overrides")
        .onDelete("CASCADE");
      table.text("image_url").notNullable();
      table.text("alt_text");
      table.integer("sort_order").notNullable().defaultTo(0);
      table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
  }

  await knex.schema.raw(
    "create index if not exists catalog_product_images_sku_idx on catalog_product_images (sku, sort_order, id)",
  );
}

export async function down() {
  // Intentionally irreversible. These tables contain storefront, payment, and
  // fulfillment records and should only be removed manually after a backup.
}

async function addColumnIfMissing(knex, tableName, columnName, addColumn) {
  const hasColumn = await knex.schema.hasColumn(tableName, columnName);

  if (hasColumn) {
    return;
  }

  await knex.schema.alterTable(tableName, addColumn);
}
