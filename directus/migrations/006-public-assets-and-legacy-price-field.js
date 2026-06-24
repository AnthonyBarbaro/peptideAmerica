import { randomUUID } from "node:crypto";

const readableFileFields = [
  "id",
  "storage",
  "filename_disk",
  "filename_download",
  "title",
  "type",
  "folder",
  "filesize",
  "width",
  "height",
  "uploaded_on",
  "modified_on",
];

export async function up(knex) {
  await markLegacyPriceFields(knex);
  await grantPublicFileRead(knex);
}

export async function down() {
  // Preserve public asset access; production storefront images depend on it.
}

async function markLegacyPriceFields(knex) {
  if (!(await knex.schema.hasTable("directus_fields"))) {
    return;
  }

  const fields = [
    {
      field: "price_cents",
      note: "Legacy field. Ignored by storefront; use Retail Price ($).",
    },
    {
      field: "cost_cents",
      note: "Legacy field. Ignored by storefront; use Private Cost ($).",
    },
  ];

  for (const field of fields) {
    await knex("directus_fields")
      .where({ collection: "catalog_product_overrides", field: field.field })
      .update(await filterToExistingColumns(knex, "directus_fields", {
        note: field.note,
        readonly: true,
        hidden: false,
      }));
  }
}

async function grantPublicFileRead(knex) {
  if (!(await knex.schema.hasTable("directus_permissions"))) {
    return;
  }

  const columns = await getColumnDetails(knex, "directus_permissions");
  const row = {
    collection: "directus_files",
    action: "read",
    permissions: {},
    validation: null,
    presets: null,
  };

  if (columns.has("fields")) {
    row.fields = await getReadableFieldsValue(knex);
  }

  if (columns.has("role")) {
    row.role = null;
  } else if (columns.has("policy")) {
    const policy = await findPublicPolicy(knex);

    if (!policy) {
      return;
    }

    row.policy = policy.id;
  }

  const idColumn = columns.get("id");

  if (idColumn && !idColumn.column_default && idColumn.is_nullable === "NO") {
    row.id = idColumn.data_type === "uuid" ? randomUUID() : undefined;
  }

  const filteredRow = await filterToExistingColumns(knex, "directus_permissions", row);
  const existingQuery = knex("directus_permissions")
    .where({ collection: "directus_files", action: "read" });

  if (columns.has("role")) {
    existingQuery.whereNull("role");
  }

  if (columns.has("policy") && filteredRow.policy) {
    existingQuery.where({ policy: filteredRow.policy });
  }

  const existing = await existingQuery.first();

  if (existing) {
    const updateRow = { ...filteredRow };
    delete updateRow.id;
    await knex("directus_permissions").where({ id: existing.id }).update(updateRow);
  } else {
    await knex("directus_permissions").insert(filteredRow);
  }
}

async function findPublicPolicy(knex) {
  if (!(await knex.schema.hasTable("directus_policies"))) {
    return null;
  }

  return (
    (await knex("directus_policies")
      .whereRaw("lower(name) = 'public'")
      .first()) ??
    (await knex("directus_policies")
      .whereRaw("lower(name) like '%public%'")
      .first()) ??
    null
  );
}

async function getReadableFieldsValue(knex) {
  const column = (await getColumnDetails(knex, "directus_permissions")).get("fields");

  if (column?.data_type === "ARRAY") {
    return readableFileFields;
  }

  if (column?.data_type === "json" || column?.data_type === "jsonb") {
    return readableFileFields;
  }

  return readableFileFields.join(",");
}

async function getColumnDetails(knex, tableName) {
  const rows = await knex("information_schema.columns")
    .select("column_name", "data_type", "column_default", "is_nullable")
    .where({ table_schema: "public", table_name: tableName });

  return new Map(rows.map((row) => [row.column_name, row]));
}

async function filterToExistingColumns(knex, tableName, data) {
  const columns = await getColumnDetails(knex, tableName);

  return Object.fromEntries(
    Object.entries(data).filter(([key, value]) => columns.has(key) && value !== undefined),
  );
}
