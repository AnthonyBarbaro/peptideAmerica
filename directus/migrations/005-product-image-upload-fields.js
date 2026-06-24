const productFields = [
  fieldMetadata("primary_image_file", "Primary Product Image", "file-image", 7, "full", false, false, false, "file"),
  fieldMetadata("secondary_image_file", "Secondary Product Image", "file-image", 8, "half", false, false, false, "file"),
  fieldMetadata("tertiary_image_file", "Tertiary Product Image", "file-image", 9, "half", false, false, false, "file"),
  fieldMetadata("category", "Category", "input", 10, "half", false, false),
  fieldMetadata("size_label", "Size Label", "input", 11, "half", false, false),
  fieldMetadata("short_description", "Card Description", "input-multiline", 12, "full", false, false),
  fieldMetadata("research_overview", "Product Page Overview", "input-multiline", 13, "full", false, false),
  fieldMetadata("purity_label", "COA Label", "input", 14, "half", false, false),
  fieldMetadata("storage_label", "Storage Label", "input", 15, "half", false, false),
  fieldMetadata("molecular_weight", "Molecular Weight", "input", 16, "half", false, false),
  fieldMetadata("sequence", "Sequence", "input-multiline", 17, "full", false, false),
  fieldMetadata("tags", "Tags", "tags", 18, "full", false, false),
  fieldMetadata("images", "Legacy Image URLs", "tags", 19, "full", false, false, true),
  fieldMetadata("technical_specs", "Technical Specs JSON", "input-code", 20, "full", false, false),
  fieldMetadata("is_featured", "Featured", "boolean", 21, "half", false, false),
  fieldMetadata("is_hidden", "Hidden From Storefront", "boolean", 22, "half", false, false),
  fieldMetadata("notes", "Internal Notes", "input-multiline", 23, "full", false, false),
  fieldMetadata("updated_by", "Updated By", "input", 24, "half", false, false),
  fieldMetadata("vial_last_synced_at", "Last Vial Sync", "datetime", 25, "half", false, true),
  fieldMetadata("created_at", "Created At", "datetime", 26, "half", false, true),
  fieldMetadata("updated_at", "Updated At", "datetime", 27, "half", false, true),
  fieldMetadata("price_cents", "Retail Price Cents", "input", 28, "half", false, false, true),
  fieldMetadata("cost_cents", "Private Cost Cents", "input", 29, "half", false, false, true),
];

const imageFields = ["primary_image_file", "secondary_image_file", "tertiary_image_file"];

export async function up(knex) {
  await knex.schema.raw(`
    alter table catalog_product_overrides
    add column if not exists primary_image_file uuid,
    add column if not exists secondary_image_file uuid,
    add column if not exists tertiary_image_file uuid
  `);

  if (await knex.schema.hasTable("directus_fields")) {
    for (const field of productFields) {
      await upsertField(knex, field);
    }
  }

  if (await knex.schema.hasTable("directus_relations")) {
    for (const field of imageFields) {
      await upsertRelation(knex, {
        many_collection: "catalog_product_overrides",
        many_field: field,
        one_collection: "directus_files",
        one_field: null,
        one_collection_field: null,
        one_allowed_collections: null,
        one_deselect_action: "nullify",
        junction_field: null,
        sort_field: null,
      });
    }
  }
}

export async function down() {
  // Preserve attached image references.
}

function fieldMetadata(
  field,
  label,
  directusInterface,
  sort,
  width,
  required,
  readonly,
  hidden = false,
  special = null,
) {
  return {
    collection: "catalog_product_overrides",
    field,
    special,
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

async function upsertField(knex, field) {
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

async function upsertRelation(knex, relation) {
  const existing = await knex("directus_relations")
    .where({
      many_collection: relation.many_collection,
      many_field: relation.many_field,
    })
    .first();
  const row = await filterToExistingColumns(knex, "directus_relations", relation);

  if (existing) {
    await knex("directus_relations")
      .where({
        many_collection: relation.many_collection,
        many_field: relation.many_field,
      })
      .update(row);
  } else {
    await knex("directus_relations").insert(row);
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
