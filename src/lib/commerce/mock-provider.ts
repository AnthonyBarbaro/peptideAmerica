import type { CoaBatch, CommerceProvider, Product, ProductQuery } from "./types";

const makeBatch = (
  id: string,
  productSlug: string,
  sku: string,
  batchNumber: string,
  purityPercent: number,
): CoaBatch => ({
  id,
  productSlug,
  sku,
  batchNumber,
  labName: "Sample Analytical Lab",
  testedAt: "2026-01-15",
  purityPercent,
  status: "sample",
  documentUrl: "/sample-coa.pdf",
  notes: "Sample/mock COA data. Replace with supplier documents before launch.",
});

export const mockProducts: Product[] = [
  {
    id: "prod_alpha",
    slug: "pa-research-peptide-alpha",
    name: "PA Research Peptide Alpha",
    sku: "PA-ALPHA-5",
    category: "Reference Peptides",
    priceCents: 8900,
    sizeLabel: "5 mg",
    stockStatus: "in_stock",
    shortDescription:
      "Placeholder catalog item with batch documents, identifier fields, and clean procurement details.",
    researchOverview:
      "A sample catalog profile for lab purchasing review, built around traceable batch records and technical identifiers.",
    technicalSpecs: [
      { label: "Format", value: "Lyophilized reference material" },
      { label: "Appearance", value: "White to off-white powder, sample entry" },
      { label: "Documentation", value: "Batch record placeholder available" },
    ],
    purityLabel: "Sample purity label pending supplier COA",
    storageLabel: "Store according to supplier documentation",
    molecularWeight: "Mock value pending supplier data",
    sequence: "Ac-Ala-Gly-Ser-NH2",
    tags: ["featured", "batch-documented", "reference"],
    images: ["alpha-placeholder"],
    coaBatches: [
      makeBatch("coa_alpha_001", "pa-research-peptide-alpha", "PA-ALPHA-5", "ALP-SAMPLE-001", 98.4),
      makeBatch("coa_alpha_002", "pa-research-peptide-alpha", "PA-ALPHA-5", "ALP-SAMPLE-002", 97.9),
    ],
  },
  {
    id: "prod_beta",
    slug: "pa-research-peptide-beta",
    name: "PA Research Peptide Beta",
    sku: "PA-BETA-10",
    category: "Reference Peptides",
    priceCents: 12900,
    sizeLabel: "10 mg",
    stockStatus: "low_stock",
    shortDescription:
      "Mock storefront entry prepared for clear specs, batch lookup, and fast catalog scanning.",
    researchOverview:
      "A neutral sample profile for comparing catalog attributes, documentation status, and inventory signals.",
    technicalSpecs: [
      { label: "Format", value: "Lyophilized reference material" },
      { label: "Appearance", value: "Sample entry, visual inspection field pending" },
      { label: "Documentation", value: "Sample batch record available" },
    ],
    purityLabel: "Sample purity label pending supplier COA",
    storageLabel: "Store according to supplier documentation",
    molecularWeight: "Mock value pending supplier data",
    sequence: "H-Val-Leu-Gly-Pro-OH",
    tags: ["low-stock", "batch-documented", "reference"],
    images: ["beta-placeholder"],
    coaBatches: [
      makeBatch("coa_beta_001", "pa-research-peptide-beta", "PA-BETA-10", "BET-SAMPLE-001", 96.8),
    ],
  },
  {
    id: "prod_gamma",
    slug: "pa-research-peptide-gamma",
    name: "PA Research Peptide Gamma",
    sku: "PA-GAMMA-5",
    category: "Specialty Materials",
    priceCents: 9900,
    sizeLabel: "5 mg",
    stockStatus: "in_stock",
    shortDescription:
      "Sample specialty listing with structured technical fields and a COA-first presentation.",
    researchOverview:
      "A placeholder specialty material entry for demonstrating product detail layout and batch navigation.",
    technicalSpecs: [
      { label: "Format", value: "Lyophilized sample material" },
      { label: "Appearance", value: "Sample entry, supplier data pending" },
      { label: "Documentation", value: "Batch record placeholder available" },
    ],
    purityLabel: "Sample purity label pending supplier COA",
    storageLabel: "Store according to supplier documentation",
    molecularWeight: "Mock value pending supplier data",
    sequence: "Ac-Gly-Phe-Lys-Ala-OH",
    tags: ["featured", "specialty", "batch-documented"],
    images: ["gamma-placeholder"],
    coaBatches: [
      makeBatch("coa_gamma_001", "pa-research-peptide-gamma", "PA-GAMMA-5", "GAM-SAMPLE-001", 98.1),
    ],
  },
  {
    id: "prod_delta",
    slug: "pa-research-peptide-delta",
    name: "PA Research Peptide Delta",
    sku: "PA-DELTA-2",
    category: "Catalog Standards",
    priceCents: 14900,
    sizeLabel: "2 mg",
    stockStatus: "out_of_stock",
    shortDescription:
      "Mock standard entry showing unavailable inventory, batch history, and spec placeholders.",
    researchOverview:
      "A sample standard profile for inventory states, catalog organization, and documentation workflows.",
    technicalSpecs: [
      { label: "Format", value: "Lyophilized standard material" },
      { label: "Appearance", value: "Sample entry, supplier data pending" },
      { label: "Documentation", value: "Historical sample batch record available" },
    ],
    purityLabel: "Sample purity label pending supplier COA",
    storageLabel: "Store according to supplier documentation",
    molecularWeight: "Mock value pending supplier data",
    sequence: "H-Ser-Tyr-Gly-Leu-NH2",
    tags: ["standard", "batch-documented"],
    images: ["delta-placeholder"],
    coaBatches: [
      makeBatch("coa_delta_001", "pa-research-peptide-delta", "PA-DELTA-2", "DEL-SAMPLE-001", 97.2),
    ],
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

const productMatches = (product: Product, search: string) => {
  const term = normalize(search);

  if (!term) {
    return true;
  }

  return [
    product.name,
    product.sku,
    product.category,
    product.shortDescription,
    ...product.tags,
  ].some((value) => normalize(value).includes(term));
};

const sortProducts = (products: Product[], sort: ProductQuery["sort"] = "featured") => {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.priceCents - b.priceCents);
    case "price-desc":
      return sorted.sort((a, b) => b.priceCents - a.priceCents);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return sorted.sort((a, b) => {
        const aFeatured = a.tags.includes("featured") ? 0 : 1;
        const bFeatured = b.tags.includes("featured") ? 0 : 1;
        return aFeatured - bFeatured || a.name.localeCompare(b.name);
      });
  }
};

export const mockCommerceProvider: CommerceProvider = {
  name: "mock",
  async listProducts(query = {}) {
    const filtered = mockProducts.filter((product) => {
      const categoryMatches = !query.category || product.category === query.category;
      const searchMatches = !query.search || productMatches(product, query.search);

      return categoryMatches && searchMatches;
    });

    const sorted = sortProducts(filtered, query.sort);

    return typeof query.first === "number" ? sorted.slice(0, query.first) : sorted;
  },
  async getProduct(slug) {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  },
  async searchProducts(query) {
    return mockProducts.filter((product) => productMatches(product, query));
  },
  async listCategories() {
    return Array.from(new Set(mockProducts.map((product) => product.category))).sort();
  },
  async listCoaBatches(productSlug) {
    const batches = mockProducts.flatMap((product) => product.coaBatches);

    return productSlug
      ? batches.filter((batch) => batch.productSlug === productSlug)
      : batches;
  },
};
