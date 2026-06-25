const simpleResearchAreas = [
  {
    skus: ["AOD9604-10MG"],
    category: "Metabolic",
    shortDescription: "Metabolic",
    tags: ["metabolic", "analytical reference"],
  },
  {
    skus: ["BPC157-10MG", "BPC157-5MG"],
    category: "Cellular",
    shortDescription: "Cellular",
    tags: ["cellular", "analytical reference"],
  },
  {
    skus: ["GHKCU-50MG"],
    category: "Copper Complex",
    shortDescription: "Copper Complex",
    tags: ["copper complex", "analytical reference"],
  },
  {
    skus: ["GLOW-70MG"],
    category: "Peptide Blend",
    shortDescription: "Peptide Blend",
    tags: ["peptide blend", "analytical reference"],
  },
  {
    skus: ["HCG-10000IU"],
    category: "Glycoprotein",
    shortDescription: "Glycoprotein",
    tags: ["glycoprotein", "analytical reference"],
  },
  {
    skus: ["NAD-1000MG"],
    category: "Cofactor",
    shortDescription: "Cofactor",
    tags: ["cofactor", "analytical reference"],
  },
  {
    skus: ["RETATRUTIDE-20MG", "RETATRUTIDE-30MG"],
    category: "Metabolic",
    shortDescription: "Metabolic",
    tags: ["metabolic", "analytical reference"],
  },
  {
    skus: ["TB500-10MG", "TB500-5MG"],
    category: "Cellular",
    shortDescription: "Cellular",
    tags: ["cellular", "analytical reference"],
  },
];

export async function up(knex) {
  if (!(await knex.schema.hasTable("catalog_product_overrides"))) {
    return;
  }

  for (const entry of simpleResearchAreas) {
    for (const sku of entry.skus) {
      await knex("catalog_product_overrides")
        .where({ sku })
        .update({
          category: entry.category,
          short_description: entry.shortDescription,
          tags: entry.tags,
          updated_by: "codex-simple-research-areas",
          updated_at: knex.fn.now(),
        });
    }
  }
}

export async function down() {
  // Keep edited catalog labels in place.
}
