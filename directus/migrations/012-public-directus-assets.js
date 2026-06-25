import { randomUUID } from "node:crypto";

const PUBLIC_ASSETS_POLICY_NAME = "Public Website Assets";

export async function up(knex) {
  await ensurePublicAssetAccess(knex);
}

export async function down() {
  // Storefront product images depend on public asset access.
}

async function ensurePublicAssetAccess(knex) {
  if (!(await knex.schema.hasTable("directus_permissions"))) {
    return;
  }

  const permissionColumns = await getColumnDetails(knex, "directus_permissions");
  const policyId = permissionColumns.has("policy")
    ? await ensureAnonymousPublicPolicy(knex)
    : null;

  if (permissionColumns.has("policy") && !policyId) {
    return;
  }

  for (const collection of ["directus_files", "directus_folders"]) {
    await upsertPublicReadPermission(knex, permissionColumns, collection, policyId);
  }
}

async function ensureAnonymousPublicPolicy(knex) {
  if (!(await knex.schema.hasTable("directus_policies"))) {
    return null;
  }

  const existingPolicy =
    (await knex("directus_policies")
      .whereRaw("lower(name) = 'public'")
      .first()) ??
    (await knex("directus_policies")
      .whereRaw("lower(name) = ?", [PUBLIC_ASSETS_POLICY_NAME.toLowerCase()])
      .first()) ??
    (await knex("directus_policies")
      .whereRaw("lower(name) like '%public%'")
      .first());

  const policyId = existingPolicy?.id ?? (await createPublicAssetsPolicy(knex));
  await ensureAnonymousAccess(knex, policyId);

  return policyId;
}

async function createPublicAssetsPolicy(knex) {
  const policyColumns = await getColumnDetails(knex, "directus_policies");
  const idColumn = policyColumns.get("id");
  const id = idColumn?.data_type === "uuid" || !idColumn ? randomUUID() : undefined;
  const row = await filterToExistingColumns(knex, "directus_policies", {
    id,
    name: PUBLIC_ASSETS_POLICY_NAME,
    icon: "image",
    description: "Allows anonymous storefront requests to load product image assets.",
    admin_access: false,
    app_access: false,
    enforce_tfa: false,
  });
  const [created] = await knex("directus_policies").insert(row).returning("id");

  return typeof created === "object" ? created.id : created;
}

async function ensureAnonymousAccess(knex, policyId) {
  if (!(await knex.schema.hasTable("directus_access"))) {
    return;
  }

  const accessColumns = await getColumnDetails(knex, "directus_access");
  const existingQuery = knex("directus_access").where({ policy: policyId });

  if (accessColumns.has("role")) {
    existingQuery.whereNull("role");
  }

  if (accessColumns.has("user")) {
    existingQuery.whereNull("user");
  }

  if (await existingQuery.first()) {
    return;
  }

  const idColumn = accessColumns.get("id");
  const row = await filterToExistingColumns(knex, "directus_access", {
    id: idColumn?.data_type === "uuid" || !idColumn ? randomUUID() : undefined,
    role: null,
    user: null,
    policy: policyId,
    sort: null,
  });

  await knex("directus_access").insert(row);
}

async function upsertPublicReadPermission(knex, columns, collection, policyId) {
  const row = {
    collection,
    action: "read",
    permissions: {},
    validation: null,
    presets: null,
  };

  if (columns.has("fields")) {
    row.fields = getAllFieldsValue(columns.get("fields"));
  }

  if (columns.has("policy") && policyId) {
    row.policy = policyId;
  }

  if (columns.has("role")) {
    row.role = null;
  }

  const idColumn = columns.get("id");

  if (idColumn && !idColumn.column_default && idColumn.is_nullable === "NO") {
    row.id = idColumn.data_type === "uuid" ? randomUUID() : undefined;
  }

  const filteredRow = await filterToExistingColumns(knex, "directus_permissions", row);
  const existingQuery = knex("directus_permissions").where({
    collection,
    action: "read",
  });

  if (columns.has("policy") && policyId) {
    existingQuery.where({ policy: policyId });
  }

  if (columns.has("role")) {
    existingQuery.whereNull("role");
  }

  const existing = await existingQuery.first();

  if (existing) {
    const updateRow = { ...filteredRow };
    delete updateRow.id;

    await knex("directus_permissions").where({ id: existing.id }).update(updateRow);
    return;
  }

  await knex("directus_permissions").insert(filteredRow);
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
