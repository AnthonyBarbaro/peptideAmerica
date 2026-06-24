import { randomUUID } from "node:crypto";

export async function up(knex) {
  await grantFileReadToWebsiteAndStudioPolicies(knex);
}

export async function down() {
  // Product image rendering depends on these file permissions.
}

async function grantFileReadToWebsiteAndStudioPolicies(knex) {
  if (!(await knex.schema.hasTable("directus_permissions"))) {
    return;
  }

  const permissionColumns = await getColumnDetails(knex, "directus_permissions");
  const policyIds = await getWebsiteAndStudioPolicyIds(knex);

  if (permissionColumns.has("policy") && policyIds.length === 0) {
    return;
  }

  const fieldsValue = await getReadableFileFieldsValue(knex, permissionColumns.get("fields"));

  if (permissionColumns.has("policy")) {
    for (const policyId of policyIds) {
      await upsertDirectusFilesReadPermission(knex, permissionColumns, {
        policy: policyId,
        fields: fieldsValue,
      });
    }

    return;
  }

  await upsertDirectusFilesReadPermission(knex, permissionColumns, {
    role: null,
    fields: fieldsValue,
  });
}

async function getWebsiteAndStudioPolicyIds(knex) {
  if (!(await knex.schema.hasTable("directus_policies"))) {
    return [];
  }

  const policyIds = new Set();
  const policyColumns = await getColumnDetails(knex, "directus_policies");

  if (await knex.schema.hasTable("directus_access")) {
    const accessColumns = await getColumnDetails(knex, "directus_access");

    if (accessColumns.has("policy")) {
      const anonymousAccessQuery = knex("directus_access")
        .select("policy")
        .whereNotNull("policy");

      if (accessColumns.has("role")) {
        anonymousAccessQuery.whereNull("role");
      }

      if (accessColumns.has("user")) {
        anonymousAccessQuery.whereNull("user");
      }

      const anonymousAccessRows = await anonymousAccessQuery;

      for (const row of anonymousAccessRows) {
        policyIds.add(row.policy);
      }
    }
  }

  const publicPolicies = await knex("directus_policies")
    .select("id")
    .whereRaw("lower(name) = 'public'")
    .orWhereRaw("lower(name) like '%public%'");

  for (const policy of publicPolicies) {
    policyIds.add(policy.id);
  }

  const appPolicyQuery = knex("directus_policies").select("id");

  if (policyColumns.has("app_access") && policyColumns.has("admin_access")) {
    appPolicyQuery.where((builder) =>
      builder.where({ app_access: true }).orWhere({ admin_access: true }),
    );
  } else if (policyColumns.has("app_access")) {
    appPolicyQuery.where({ app_access: true });
  } else if (policyColumns.has("admin_access")) {
    appPolicyQuery.where({ admin_access: true });
  }

  const appPolicies = await appPolicyQuery;

  for (const policy of appPolicies) {
    policyIds.add(policy.id);
  }

  if (policyIds.size > 0) {
    return [...policyIds];
  }

  const createdPublicPolicy = await ensurePublicWebsiteAssetsPolicy(knex, policyColumns);

  if (!createdPublicPolicy) {
    return [];
  }

  await ensureAnonymousAccess(knex, createdPublicPolicy);
  return [createdPublicPolicy];
}

async function ensurePublicWebsiteAssetsPolicy(knex, policyColumns) {
  const existing = await knex("directus_policies")
    .whereRaw("lower(name) = 'public website assets'")
    .first();

  if (existing) {
    return existing.id;
  }

  const idColumn = policyColumns.get("id");
  const id = idColumn?.data_type === "uuid" || !idColumn ? randomUUID() : undefined;
  const row = await filterToExistingColumns(knex, "directus_policies", {
    id,
    name: "Public Website Assets",
    icon: "image",
    description: "Allows storefront product images to load without exposing admin access.",
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

async function upsertDirectusFilesReadPermission(knex, columns, values) {
  const idColumn = columns.get("id");
  const row = {
    collection: "directus_files",
    action: "read",
    permissions: {},
    validation: null,
    presets: null,
    ...values,
  };

  if (idColumn && !idColumn.column_default && idColumn.is_nullable === "NO") {
    row.id = idColumn.data_type === "uuid" ? randomUUID() : undefined;
  }

  if (columns.has("role") && !("role" in row)) {
    row.role = null;
  }

  const filteredRow = await filterToExistingColumns(knex, "directus_permissions", row);
  const existingQuery = knex("directus_permissions").where({
    collection: "directus_files",
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

async function getReadableFileFieldsValue(knex, permissionFieldsColumn) {
  const fileColumns = await getColumnDetails(knex, "directus_files");
  const fieldNames = [...fileColumns.keys()].sort();

  if (permissionFieldsColumn?.data_type === "ARRAY") {
    return fieldNames;
  }

  if (permissionFieldsColumn?.data_type === "json" || permissionFieldsColumn?.data_type === "jsonb") {
    return fieldNames;
  }

  return fieldNames.join(",");
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
