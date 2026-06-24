const collections = [
  {
    collection: "catalog_product_overrides",
    icon: "inventory_2",
    note: "Storefront product pricing, product copy, private cost, and visibility overrides.",
    display_template: "{{product_name}} ({{sku}})",
    hidden: false,
    singleton: false,
    sort: 1,
    accountability: "all",
  },
  {
    collection: "catalog_product_images",
    icon: "image",
    note: "Storefront product image URLs keyed by Vial SKU.",
    display_template: "{{sku}} - {{image_url}}",
    hidden: false,
    singleton: false,
    sort: 2,
    accountability: "all",
  },
  {
    collection: "commerce_orders",
    icon: "receipt_long",
    note: "Read-only order ledger populated by checkout, payment, and Vial fulfillment events.",
    display_template: "{{external_order_id}}",
    hidden: false,
    singleton: false,
    sort: 3,
    accountability: "all",
  },
  {
    collection: "payment_events",
    icon: "payments",
    note: "Authorize.Net payment webhook event log.",
    display_template: "{{notification_id}}",
    hidden: false,
    singleton: false,
    sort: 4,
    accountability: "all",
  },
  {
    collection: "fulfillment_events",
    icon: "local_shipping",
    note: "Vial fulfillment webhook event log.",
    display_template: "{{delivery_id}}",
    hidden: false,
    singleton: false,
    sort: 5,
    accountability: "all",
  },
];

const fields = [
  productField("sku", "SKU", "input", 1, "half", true),
  productField("product_name", "Vial Product Name", "input", 2, "half", false, true),
  productField("product_slug", "Storefront Slug", "input", 3, "half", false, true),
  productField("stock_status", "Vial Stock Status", "input", 4, "half", false, true),
  productField("price_dollars", "Retail Price ($)", "input", 5, "half", false),
  productField("cost_dollars", "Private Cost ($)", "input", 6, "half", false),
  productField("category", "Category", "input", 7, "half", false),
  productField("size_label", "Size Label", "input", 8, "half", false),
  productField("short_description", "Card Description", "input-multiline", 9, "full", false),
  productField("research_overview", "Product Page Overview", "input-multiline", 10, "full", false),
  productField("purity_label", "COA Label", "input", 11, "half", false),
  productField("storage_label", "Storage Label", "input", 12, "half", false),
  productField("molecular_weight", "Molecular Weight", "input", 13, "half", false),
  productField("sequence", "Sequence", "input-multiline", 14, "full", false),
  productField("tags", "Tags", "tags", 15, "full", false),
  productField("images", "Legacy Image URLs", "tags", 16, "full", false),
  productField("technical_specs", "Technical Specs JSON", "input-code", 17, "full", false),
  productField("is_featured", "Featured", "boolean", 18, "half", false),
  productField("is_hidden", "Hidden From Storefront", "boolean", 19, "half", false),
  productField("notes", "Internal Notes", "input-multiline", 20, "full", false),
  productField("updated_by", "Updated By", "input", 21, "half", false),
  productField("vial_last_synced_at", "Last Vial Sync", "datetime", 22, "half", false, true),
  productField("created_at", "Created At", "datetime", 23, "half", false, true),
  productField("updated_at", "Updated At", "datetime", 24, "half", false, true),
  productField("price_cents", "Retail Price Cents", "input", 25, "half", false, false, true),
  productField("cost_cents", "Private Cost Cents", "input", 26, "half", false, false, true),

  imageField("id", "ID", "input", 1, "half", true, true),
  imageField("sku", "SKU", "input", 2, "half", true),
  imageField("image_url", "Image URL", "input", 3, "full", true),
  imageField("alt_text", "Alt Text", "input", 4, "full", false),
  imageField("sort_order", "Sort Order", "input", 5, "half", false),
  imageField("created_at", "Created At", "datetime", 6, "half", false, true),
  imageField("updated_at", "Updated At", "datetime", 7, "half", false, true),

  orderField("external_order_id", "Order ID", "input", 1, "half", true, true),
  orderField("status", "Status", "input", 2, "half", false, true),
  orderField("customer_email", "Customer Email", "input", 3, "half", false, true),
  orderField("customer_first_name", "First Name", "input", 4, "half", false, true),
  orderField("customer_last_name", "Last Name", "input", 5, "half", false, true),
  orderField("amount_cents", "Amount Cents", "input", 6, "half", false, true),
  orderField("payment_transaction_id", "Payment Transaction", "input", 7, "half", false, true),
  orderField("vial_order_id", "Vial Order ID", "input", 8, "half", false, true),
  orderField("vial_status", "Vial Status", "input", 9, "half", false, true),
  orderField("tracking", "Tracking JSON", "input-code", 10, "full", false, true),
  orderField("items", "Items JSON", "input-code", 11, "full", false, true),
  orderField("shipping_address", "Shipping Address JSON", "input-code", 12, "full", false, true),
  orderField("created_at", "Created At", "datetime", 13, "half", false, true),
  orderField("updated_at", "Updated At", "datetime", 14, "half", false, true),
  orderField("paid_at", "Paid At", "datetime", 15, "half", false, true),
  orderField("submitted_to_vial_at", "Submitted To Vial At", "datetime", 16, "half", false, true),

  eventField("payment_events", "notification_id", "Notification ID", 1),
  eventField("payment_events", "external_order_id", "Order ID", 2),
  eventField("payment_events", "event_type", "Event Type", 3),
  eventField("payment_events", "transaction_id", "Transaction ID", 4),
  eventField("payment_events", "response_code", "Response Code", 5),
  eventField("payment_events", "payload", "Payload JSON", 6, "input-code", "full"),
  eventField("payment_events", "received_at", "Received At", 7, "datetime", "half"),

  eventField("fulfillment_events", "delivery_id", "Delivery ID", 1),
  eventField("fulfillment_events", "external_order_id", "Order ID", 2),
  eventField("fulfillment_events", "event_type", "Event Type", 3),
  eventField("fulfillment_events", "vialapi_order_id", "Vial Order ID", 4),
  eventField("fulfillment_events", "status", "Status", 5),
  eventField("fulfillment_events", "tracking", "Tracking JSON", 6, "input-code", "full"),
  eventField("fulfillment_events", "payload", "Payload JSON", 7, "input-code", "full"),
  eventField("fulfillment_events", "received_at", "Received At", 8, "datetime", "half"),
];

export async function up(knex) {
  if (!(await knex.schema.hasTable("directus_collections"))) {
    return;
  }

  for (const collection of collections) {
    await upsertRow(knex, "directus_collections", "collection", collection);
  }

  if (!(await knex.schema.hasTable("directus_fields"))) {
    return;
  }

  for (const field of fields) {
    const existing = await knex("directus_fields")
      .where({ collection: field.collection, field: field.field })
      .first();
    const row = await filterToExistingColumns(knex, "directus_fields", field);

    if (existing) {
      await knex("directus_fields")
        .where({ collection: field.collection, field: field.field })
        .update(row);
    } else {
      await knex("directus_fields").insert(row);
    }
  }
}

export async function down(knex) {
  if (await knex.schema.hasTable("directus_fields")) {
    for (const field of fields) {
      await knex("directus_fields")
        .where({ collection: field.collection, field: field.field })
        .delete();
    }
  }

  if (await knex.schema.hasTable("directus_collections")) {
    for (const collection of collections) {
      await knex("directus_collections").where({ collection: collection.collection }).delete();
    }
  }
}

function productField(field, label, directusInterface, sort, width, required, readonly = false, hidden = false) {
  return fieldMetadata(
    "catalog_product_overrides",
    field,
    label,
    directusInterface,
    sort,
    width,
    required,
    readonly,
    hidden,
  );
}

function imageField(field, label, directusInterface, sort, width, required, readonly = false, hidden = false) {
  return fieldMetadata(
    "catalog_product_images",
    field,
    label,
    directusInterface,
    sort,
    width,
    required,
    readonly,
    hidden,
  );
}

function orderField(field, label, directusInterface, sort, width, required, readonly = true, hidden = false) {
  return fieldMetadata(
    "commerce_orders",
    field,
    label,
    directusInterface,
    sort,
    width,
    required,
    readonly,
    hidden,
  );
}

function eventField(
  collection,
  field,
  label,
  sort,
  directusInterface = "input",
  width = "half",
) {
  return fieldMetadata(collection, field, label, directusInterface, sort, width, false, true, false);
}

function fieldMetadata(
  collection,
  field,
  label,
  directusInterface,
  sort,
  width,
  required,
  readonly,
  hidden,
) {
  return {
    collection,
    field,
    interface: directusInterface,
    display: "raw",
    readonly,
    hidden,
    required,
    sort,
    width,
    note: label,
  };
}

async function upsertRow(knex, tableName, keyName, data) {
  const row = await filterToExistingColumns(knex, tableName, data);
  const existing = await knex(tableName).where({ [keyName]: data[keyName] }).first();

  if (existing) {
    await knex(tableName).where({ [keyName]: data[keyName] }).update(row);
  } else {
    await knex(tableName).insert(row);
  }
}

async function filterToExistingColumns(knex, tableName, data) {
  const columns = await knex("information_schema.columns")
    .select("column_name")
    .where({ table_schema: "public", table_name: tableName });
  const allowed = new Set(columns.map((column) => column.column_name));

  return Object.fromEntries(
    Object.entries(data).filter(([key]) => allowed.has(key)),
  );
}
