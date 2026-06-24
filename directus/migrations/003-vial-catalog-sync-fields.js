const productFields = [
  fieldMetadata("sku", "SKU", "input", 1, "half", true, false),
  fieldMetadata("product_name", "Vial Product Name", "input", 2, "half", false, true),
  fieldMetadata("product_slug", "Storefront Slug", "input", 3, "half", false, true),
  fieldMetadata("stock_status", "Vial Stock Status", "input", 4, "half", false, true),
  fieldMetadata("price_dollars", "Retail Price ($)", "input", 5, "half", false, false),
  fieldMetadata("cost_dollars", "Private Cost ($)", "input", 6, "half", false, false),
  fieldMetadata("category", "Category", "input", 7, "half", false, false),
  fieldMetadata("size_label", "Size Label", "input", 8, "half", false, false),
  fieldMetadata("short_description", "Card Description", "input-multiline", 9, "full", false, false),
  fieldMetadata("research_overview", "Product Page Overview", "input-multiline", 10, "full", false, false),
  fieldMetadata("purity_label", "COA Label", "input", 11, "half", false, false),
  fieldMetadata("storage_label", "Storage Label", "input", 12, "half", false, false),
  fieldMetadata("molecular_weight", "Molecular Weight", "input", 13, "half", false, false),
  fieldMetadata("sequence", "Sequence", "input-multiline", 14, "full", false, false),
  fieldMetadata("tags", "Tags", "tags", 15, "full", false, false),
  fieldMetadata("images", "Legacy Image URLs", "tags", 16, "full", false, false),
  fieldMetadata("technical_specs", "Technical Specs JSON", "input-code", 17, "full", false, false),
  fieldMetadata("is_featured", "Featured", "boolean", 18, "half", false, false),
  fieldMetadata("is_hidden", "Hidden From Storefront", "boolean", 19, "half", false, false),
  fieldMetadata("notes", "Internal Notes", "input-multiline", 20, "full", false, false),
  fieldMetadata("updated_by", "Updated By", "input", 21, "half", false, false),
  fieldMetadata("vial_last_synced_at", "Last Vial Sync", "datetime", 22, "half", false, true),
  fieldMetadata("created_at", "Created At", "datetime", 23, "half", false, true),
  fieldMetadata("updated_at", "Updated At", "datetime", 24, "half", false, true),
  fieldMetadata("price_cents", "Retail Price Cents", "input", 25, "half", false, false, true),
  fieldMetadata("cost_cents", "Private Cost Cents", "input", 26, "half", false, false, true),
];

export async function up(knex) {
  await knex.schema.raw(`
    alter table catalog_product_overrides
    add column if not exists product_name text,
    add column if not exists product_slug text,
    add column if not exists stock_status text,
    add column if not exists vial_last_synced_at timestamptz,
    add column if not exists price_dollars numeric(10, 2),
    add column if not exists cost_dollars numeric(10, 2)
  `);

  await knex.schema.raw(
    "create unique index if not exists catalog_product_images_sku_url_idx on catalog_product_images (sku, image_url)",
  );
  await knex.schema.raw(`
    update catalog_product_overrides
    set price_dollars = round(price_cents::numeric / 100, 2)
    where price_dollars is null
      and price_cents is not null
  `);
  await knex.schema.raw(`
    update catalog_product_overrides
    set cost_dollars = round(cost_cents::numeric / 100, 2)
    where cost_dollars is null
      and cost_cents is not null
  `);

  if (await knex.schema.hasTable("directus_collections")) {
    await knex("directus_collections")
      .where({ collection: "catalog_product_overrides" })
      .update({ display_template: "{{product_name}} ({{sku}})" });
  }

  if (!(await knex.schema.hasTable("directus_fields"))) {
    return;
  }

  for (const field of productFields) {
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

export async function down() {
  // Preserve synced catalog data.
}

function fieldMetadata(field, label, directusInterface, sort, width, required, readonly, hidden = false) {
  return {
    collection: "catalog_product_overrides",
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

async function filterToExistingColumns(knex, tableName, data) {
  const columns = await knex("information_schema.columns")
    .select("column_name")
    .where({ table_schema: "public", table_name: tableName });
  const allowed = new Set(columns.map((column) => column.column_name));

  return Object.fromEntries(
    Object.entries(data).filter(([key]) => allowed.has(key)),
  );
}
