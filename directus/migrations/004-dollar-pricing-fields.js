const productFields = [
  fieldMetadata("price_dollars", "Retail Price ($)", "input", 5, "half", false, false),
  fieldMetadata("cost_dollars", "Private Cost ($)", "input", 6, "half", false, false),
  fieldMetadata("price_cents", "Retail Price Cents", "input", 25, "half", false, false, true),
  fieldMetadata("cost_cents", "Private Cost Cents", "input", 26, "half", false, false, true),
];

export async function up(knex) {
  await knex.schema.raw(`
    alter table catalog_product_overrides
    add column if not exists price_dollars numeric(10, 2),
    add column if not exists cost_dollars numeric(10, 2)
  `);

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
  // Preserve pricing data.
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
