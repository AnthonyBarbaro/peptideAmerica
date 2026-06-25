import { randomUUID } from "node:crypto";

const DIRECTUS_PUBLIC_POLICY_ID = "abf8a154-5b1c-4a46-ac9c-7300570f4f17";
const PUBLIC_ASSET_COLLECTIONS = ["directus_files", "directus_folders"];

export async function up(knex) {
  await repairPublicAssetAccess(knex);
}

export async function down() {
  // Product images must remain publicly readable for the storefront.
}

async function repairPublicAssetAccess(knex) {
  if (!(await knex.schema.hasTable("directus_permissions"))) {
    return;
  }

  const permissionColumns = await getColumnDetails(knex, "directus_permissions");

  if (permissionColumns.has("policy")) {
    const policyIds = await ensureAnonymousPolicies(knex);

    for (const policyId of policyIds) {
      for (const collection of PUBLIC_ASSET_COLLECTIONS) {
        await upsertReadPermission(knex, permissionColumns, collection, { policy: policyId });
      }
    }

    return;
  }

  for (const collection of PUBLIC_ASSET_COLLECTIONS) {
    await upsertReadPermission(knex, permissionColumns, collection, { role: null });
  }
}

async function ensureAnonymousPolicies(knex) {
  if (
    !(await knex.schema.hasTable("directus_policies")) ||
    !(await knex.schema.hasTable("directus_access"))
  ) {
    return [];
  }

  const publicPolicyId = await ensureDirectusPublicPolicy(knex);
  await ensureAnonymousAccess(knex, publicPolicyId);

  return [...new Set([publicPolicyId, ...(await getExistingAnonymousPolicyIds(knex))])];
}

async function ensureDirectusPublicPolicy(knex) {
  const existing =
    (await knex("directus_policies").where({ id: DIRECTUS_PUBLIC_POLICY_ID }).first()) ??
    (await knex("directus_policies").where({ name: "$t:public_label" }).first()) ??
    (await knex("directus_policies").whereRaw("lower(name) = 'public'").first());

  if (existing) {
    return existing.id;
  }

  const policyColumns = await getColumnDetails(knex, "directus_policies");
  const row = await filterToExistingColumns(knex, "directus_policies", {
    id: DIRECTUS_PUBLIC_POLICY_ID,
    name: "$t:public_label",
    icon: "public",
    description: "$t:public_description",
    admin_access: false,
    app_access: false,
    enforce_tfa: false,
    ip_access: null,
  });

  if (policyColumns.has("id")) {
    await knex("directus_policies").insert(row);
    return DIRECTUS_PUBLIC_POLICY_ID;
  }

  const [created] = await knex("directus_policies").insert(row).returning("id");
  return typeof created === "object" ? created.id : created;
}

async function getExistingAnonymousPolicyIds(knex) {
  const accessColumns = await getColumnDetails(knex, "directus_access");
  const query = knex("directus_access").select("policy").whereNotNull("policy");

  if (accessColumns.has("role")) {
    query.whereNull("role");
  }

  if (accessColumns.has("user")) {
    query.whereNull("user");
  }

  const rows = await query;

  return rows.map((row) => row.policy).filter(Boolean);
}

async function ensureAnonymousAccess(knex, policyId) {
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
    sort: 1,
  });

  await knex("directus_access").insert(row);
}

async function upsertReadPermission(knex, columns, collection, accessValues) {
  if (!(await knex.schema.hasTable(collection))) {
    return;
  }

  const idColumn = columns.get("id");
  const row = {
    collection,
    action: "read",
    permissions: null,
    validation: null,
    presets: null,
    ...accessValues,
  };

  if (columns.has("fields")) {
    row.fields = await getReadableFieldsValue(knex, collection, columns.get("fields"));
  }

  if (idColumn && !idColumn.column_default && idColumn.is_nullable === "NO") {
    row.id = idColumn.data_type === "uuid" ? randomUUID() : undefined;
  }

  const filteredRow = await filterToExistingColumns(knex, "directus_permissions", row);
  const existingQuery = knex("directus_permissions").where({
    collection,
    action: "read",
  });

  if (columns.has("policy") && filteredRow.policy) {
    existingQuery.where({ policy: filteredRow.policy });
  }

  if (columns.has("role") && "role" in filteredRow) {
    if (filteredRow.role === null) {
      existingQuery.whereNull("role");
    } else {
      existingQuery.where({ role: filteredRow.role });
    }
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

async function getReadableFieldsValue(knex, collection, fieldsColumn) {
  const fields = [...(await getColumnDetails(knex, collection)).keys()].sort();

  if (fieldsColumn?.data_type === "ARRAY") {
    return fields;
  }

  if (fieldsColumn?.data_type === "json" || fieldsColumn?.data_type === "jsonb") {
    return fields;
  }

  return fields.join(",");
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
