import { randomUUID } from "node:crypto";

export async function up(knex) {
  await grantPublicFileRead(knex);
}

export async function down() {
  // Keep product asset access intact in production rollbacks.
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
    row.fields = getAllFieldsValue(columns.get("fields"));
  }

  if (columns.has("policy")) {
    const policy = await findPublicPolicy(knex);

    if (!policy) {
      return;
    }

    row.policy = policy.id;
  }

  if (columns.has("role")) {
    row.role = null;
  }

  const idColumn = columns.get("id");

  if (idColumn && !idColumn.column_default && idColumn.is_nullable === "NO") {
    row.id = idColumn.data_type === "uuid" ? randomUUID() : undefined;
  }

  const filteredRow = await filterToExistingColumns(knex, "directus_permissions", row);
  const existing = await findExistingPermission(knex, columns, filteredRow);

  if (existing) {
    const updateRow = { ...filteredRow };
    delete updateRow.id;

    await knex("directus_permissions").where({ id: existing.id }).update(updateRow);
    return;
  }

  await knex("directus_permissions").insert(filteredRow);
}

async function findPublicPolicy(knex) {
  if (await knex.schema.hasTable("directus_access")) {
    const accessColumns = await getColumnDetails(knex, "directus_access");

    if (accessColumns.has("policy") && (await knex.schema.hasTable("directus_policies"))) {
      const query = knex("directus_access")
        .select("directus_policies.*")
        .join("directus_policies", "directus_access.policy", "directus_policies.id")
        .whereNotNull("directus_access.policy");

      if (accessColumns.has("role")) {
        query.whereNull("directus_access.role");
      }

      if (accessColumns.has("user")) {
        query.whereNull("directus_access.user");
      }

      const anonymousPolicy = await query.first();

      if (anonymousPolicy) {
        return anonymousPolicy;
      }
    }
  }

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

async function findExistingPermission(knex, columns, row) {
  const query = knex("directus_permissions").where({
    collection: "directus_files",
    action: "read",
  });

  if (columns.has("policy") && row.policy) {
    query.where({ policy: row.policy });
  }

  if (columns.has("role")) {
    query.whereNull("role");
  }

  return query.first();
}

function getAllFieldsValue(column) {
  if (column?.data_type === "ARRAY") {
    return ["*"];
  }

  if (column?.data_type === "json" || column?.data_type === "jsonb") {
    return ["*"];
  }

  return "*";
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
