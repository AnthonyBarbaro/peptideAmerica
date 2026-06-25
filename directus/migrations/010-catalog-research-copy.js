const catalogCopy = [
  {
    skus: ["AOD9604-10MG"],
    category: "Metabolic pathway research",
    shortDescription:
      "Peptide-fragment reference material for metabolic-pathway and analytical assay workflows.",
    researchOverview:
      "AOD 9604 is represented as a defined peptide-fragment catalog item for research workflows involving identity confirmation, lot documentation, and comparative analytical studies. Use the current COA and supplier documentation for lot-specific characteristics.",
    tags: ["metabolic pathway research", "peptide fragment", "analytical reference"],
    technicalSpecs: [
      { label: "Research focus", value: "Peptide-fragment analytical studies" },
      { label: "Catalog source", value: "Vial-backed SKU" },
    ],
  },
  {
    skus: ["BPC157-10MG", "BPC157-5MG"],
    category: "Cell signaling research",
    shortDescription:
      "Pentadecapeptide reference material for stability, identity, and cell-signaling assay workflows.",
    researchOverview:
      "BPC-157 is indexed as a pentadecapeptide research material for analytical workflows focused on sequence identity, purity review, and cell-signaling model design. Review current lot documentation before catalog release.",
    tags: ["pentadecapeptide", "cell-signaling research", "stability studies"],
    technicalSpecs: [
      { label: "Research focus", value: "Pentadecapeptide characterization" },
      { label: "Catalog source", value: "Vial-backed SKU" },
    ],
  },
  {
    skus: ["GHKCU-50MG"],
    category: "Copper peptide research",
    shortDescription:
      "Copper-binding tripeptide reference material for metal-peptide and matrix-assay workflows.",
    researchOverview:
      "GHK-CU is a copper peptide complex catalog item for metal-peptide characterization, assay planning, and lot-level documentation review. Keep product pages tied to COA and supplier records.",
    tags: ["copper peptide research", "metal-peptide complex", "analytical reference"],
    technicalSpecs: [
      { label: "Research focus", value: "Copper peptide characterization" },
      { label: "Catalog source", value: "Vial-backed SKU" },
    ],
  },
  {
    skus: ["GLOW-70MG"],
    category: "Peptide blend research",
    shortDescription:
      "Peptide blend catalog item for comparative analytical review and lot documentation workflows.",
    researchOverview:
      "GLOW is managed as a blend-style catalog record for SKU tracking, COA review, and comparative analytical workflows. Keep descriptions aligned to supplier-provided composition and lot records.",
    tags: ["peptide blend research", "comparative analysis", "lot documentation"],
    technicalSpecs: [
      { label: "Research focus", value: "Blend catalog documentation" },
      { label: "Catalog source", value: "Vial-backed SKU" },
    ],
  },
  {
    skus: ["HCG-10000IU"],
    category: "Glycoprotein hormone research",
    shortDescription:
      "Glycoprotein reference material for immunoassay, identity, and analytical workflow planning.",
    researchOverview:
      "HCG 10000iu is a glycoprotein catalog item for research workflows involving identity confirmation, assay controls, and lot-level documentation. Display details should stay aligned with current Vial and COA records.",
    tags: ["glycoprotein research", "immunoassay planning", "analytical reference"],
    technicalSpecs: [
      { label: "Research focus", value: "Glycoprotein analytical workflows" },
      { label: "Catalog source", value: "Vial-backed SKU" },
    ],
  },
  {
    skus: ["NAD-1000MG"],
    category: "Redox cofactor research",
    shortDescription:
      "NAD+ reference material for redox cofactor assay planning and analytical documentation.",
    researchOverview:
      "NAD+ 1000mg is managed as a cofactor research catalog item for redox assay planning, identity review, and lot-level documentation. Product content should remain tied to supplier and COA records.",
    tags: ["redox cofactor research", "assay planning", "analytical reference"],
    technicalSpecs: [
      { label: "Research focus", value: "Redox cofactor assay planning" },
      { label: "Catalog source", value: "Vial-backed SKU" },
    ],
  },
  {
    skus: ["RETATRUTIDE-20MG", "RETATRUTIDE-30MG"],
    category: "Incretin receptor research",
    shortDescription:
      "Multi-receptor incretin analog reference material for receptor-pathway and analytical assay workflows.",
    researchOverview:
      "Retatrutide is a multi-receptor incretin analog catalog item for research workflows involving receptor-pathway mapping, identity confirmation, and comparative analytical review. Avoid outcome claims and keep lot details tied to COA records.",
    tags: ["incretin receptor research", "metabolic pathway research", "analytical reference"],
    technicalSpecs: [
      { label: "Research focus", value: "Incretin receptor pathway mapping" },
      { label: "Catalog source", value: "Vial-backed SKU" },
    ],
  },
  {
    skus: ["TB500-10MG", "TB500-5MG"],
    category: "Actin-binding peptide research",
    shortDescription:
      "Thymosin beta-4 fragment reference material for actin-binding and peptide characterization workflows.",
    researchOverview:
      "TB-500 is represented as a thymosin beta-4 fragment catalog item for research workflows involving peptide characterization, identity review, and actin-binding pathway literature context. Use current supplier and COA records for lot-level details.",
    tags: ["actin-binding peptide research", "peptide characterization", "analytical reference"],
    technicalSpecs: [
      { label: "Research focus", value: "Thymosin beta-4 fragment characterization" },
      { label: "Catalog source", value: "Vial-backed SKU" },
    ],
  },
];

export async function up(knex) {
  if (!(await knex.schema.hasTable("catalog_product_overrides"))) {
    return;
  }

  for (const entry of catalogCopy) {
    for (const sku of entry.skus) {
      await knex("catalog_product_overrides")
        .where({ sku })
        .update({
          category: entry.category,
          short_description: entry.shortDescription,
          research_overview: entry.researchOverview,
          tags: entry.tags,
          technical_specs: knex.raw("?::jsonb", [JSON.stringify(entry.technicalSpecs)]),
          updated_by: "codex-research-copy",
          updated_at: knex.fn.now(),
        });
    }
  }
}

export async function down() {
  // Keep edited catalog copy in place.
}
