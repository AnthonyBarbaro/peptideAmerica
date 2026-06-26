export async function up(knex) {
  if (!(await knex.schema.hasTable("catalog_product_overrides"))) {
    return;
  }

  const rows = await knex("catalog_product_overrides")
    .select("sku", "product_slug")
    .whereNotNull("product_slug");

  for (const row of rows) {
    const cleanedSlug = cleanProductSlug(row.product_slug, row.sku);

    if (cleanedSlug && cleanedSlug !== row.product_slug) {
      await knex("catalog_product_overrides")
        .where({ sku: row.sku })
        .update({ product_slug: cleanedSlug });
    }
  }
}

export async function down() {
  // Preserve cleaned storefront slugs.
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanProductSlug(slug, sku) {
  const normalizedSlug = slugify(slug);
  const normalizedSku = slugify(sku);
  const duplicateSuffix = normalizedSku ? `-${normalizedSku}` : "";

  if (duplicateSuffix && normalizedSlug.endsWith(duplicateSuffix)) {
    return normalizedSlug.slice(0, -duplicateSuffix.length).replace(/-+$/, "") || normalizedSlug;
  }

  return normalizedSlug;
}
