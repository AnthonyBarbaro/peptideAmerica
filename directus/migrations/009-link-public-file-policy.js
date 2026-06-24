import { randomUUID } from "node:crypto";

export async function up(knex) {
  await linkPublicFilePolicies(knex);
}

export async function down() {
  // Storefront assets should remain publicly readable.
}

async function linkPublicFilePolicies(knex) {
  if (
    !(await knex.schema.hasTable("directus_policies")) ||
    !(await knex.schema.hasTable("directus_access"))
  ) {
    return;
  }

  const policyIds = await getPublicPolicyIds(knex);

  if (policyIds.length === 0) {
    const policyId = await createPublicWebsiteAssetsPolicy(knex);
    await ensureAnonymousAccess(knex, policyId);
    return;
  }

  for (const policyId of policyIds) {
    await ensureAnonymousAccess(knex, policyId);
  }
}

async function getPublicPolicyIds(knex) {
  const policyIds = new Set();

  const publicPolicies = await knex("directus_policies")
    .select("id")
    .whereRaw("lower(name) = 'public'")
    .orWhereRaw("lower(name) like '%public%'")
    .orWhereRaw("lower(name) like '%website assets%'");

  for (const policy of publicPolicies) {
    policyIds.add(policy.id);
  }

  const accessColumns = await getColumnDetails(knex, "directus_access");

  if (accessColumns.has("policy")) {
    const query = knex("directus_access").select("policy").whereNotNull("policy");

    if (accessColumns.has("role")) {
      query.whereNull("role");
    }

    if (accessColumns.has("user")) {
      query.whereNull("user");
    }

    const rows = await query;

    for (const row of rows) {
      policyIds.add(row.policy);
    }
  }

  return [...policyIds];
}

async function createPublicWebsiteAssetsPolicy(knex) {
  const policyColumns = await getColumnDetails(knex, "directus_policies");
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

async function getColumnDetails(knex, tableName) {
  const rows = await knex("information_schema.columns")
    .select("column_name", "data_type")
    .where({ table_schema: "public", table_name: tableName });

  return new Map(rows.map((row) => [row.column_name, row]));
}

async function filterToExistingColumns(knex, tableName, data) {
  const columns = await getColumnDetails(knex, tableName);

  return Object.fromEntries(
    Object.entries(data).filter(([key, value]) => columns.has(key) && value !== undefined),
  );
}
