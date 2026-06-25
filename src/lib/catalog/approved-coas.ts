import type { CoaBatch, Product } from "@/lib/commerce/types";

type ApprovedCoaDefinition = Omit<CoaBatch, "productSlug"> & {
  productSlug: string;
  attachToCatalogProduct: boolean;
};

const documentBasePath = "/coa/third-party";

const approvedCoaDefinitions: ApprovedCoaDefinition[] = [
  {
    id: "cjc-1295-no-dac-ipamorelin-5mg-5mg-heavy-metals",
    productSlug: "cjc-1295-no-dac-ipamorelin-5mg-5mg",
    productName: "CJC-1295 No DAC / Ipamorelin 5mg + 5mg",
    sku: "CJC-1295-NO-DAC-IPAMORELIN-5MG-5MG",
    batchNumber: "CJC-1295 / Ipamorelin heavy metals",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/cjc-1295-no-dac-ipamorelin-5mg-5mg-heavy-metals.pdf`,
    notes: "Supplier COA document for heavy metals testing.",
    attachToCatalogProduct: false,
  },
  {
    id: "cjc-1295-no-dac-ipamorelin-5mg-5mg-purity",
    productSlug: "cjc-1295-no-dac-ipamorelin-5mg-5mg",
    productName: "CJC-1295 No DAC / Ipamorelin 5mg + 5mg",
    sku: "CJC-1295-NO-DAC-IPAMORELIN-5MG-5MG",
    batchNumber: "CJC-1295 / Ipamorelin purity",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/cjc-1295-no-dac-ipamorelin-5mg-5mg-purity.pdf`,
    notes: "Supplier COA document for purity testing.",
    attachToCatalogProduct: false,
  },
  {
    id: "glow-70mg-heavy-metals",
    productSlug: "glow-70mg",
    productName: "GLOW 70mg",
    sku: "GLOW-70MG",
    batchNumber: "GLOW 70mg heavy metals",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/glow-70mg-heavy-metals.pdf`,
    notes: "Supplier COA document for heavy metals testing.",
    attachToCatalogProduct: true,
  },
  {
    id: "glow-70mg-purity",
    productSlug: "glow-70mg",
    productName: "GLOW 70mg",
    sku: "GLOW-70MG",
    batchNumber: "GLOW 70mg purity",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/glow-70mg-purity.pdf`,
    notes: "Supplier COA document for purity testing.",
    attachToCatalogProduct: true,
  },
  {
    id: "nad-1000mg-heavy-metals",
    productSlug: "nad-1000mg",
    productName: "NAD+ 1000mg",
    sku: "NAD-1000MG",
    batchNumber: "NAD+ 1000mg heavy metals",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/nad-1000mg-heavy-metals.pdf`,
    notes: "Supplier COA document for heavy metals testing.",
    attachToCatalogProduct: true,
  },
  {
    id: "nad-1000mg-purity",
    productSlug: "nad-1000mg",
    productName: "NAD+ 1000mg",
    sku: "NAD-1000MG",
    batchNumber: "NAD+ 1000mg purity",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/nad-1000mg-purity.pdf`,
    notes: "Supplier COA document for purity testing.",
    attachToCatalogProduct: true,
  },
  {
    id: "retatrutide-60mg-heavy-metals",
    productSlug: "retatrutide-60mg",
    productName: "Retatrutide 60mg",
    sku: "RETATRUTIDE-60MG",
    batchNumber: "Retatrutide 60mg heavy metals",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/retatrutide-60mg-heavy-metals.pdf`,
    notes: "Supplier COA document for heavy metals testing.",
    attachToCatalogProduct: false,
  },
  {
    id: "retatrutide-60mg-purity",
    productSlug: "retatrutide-60mg",
    productName: "Retatrutide 60mg",
    sku: "RETATRUTIDE-60MG",
    batchNumber: "Retatrutide 60mg purity",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/retatrutide-60mg-purity.pdf`,
    notes: "Supplier COA document for purity testing.",
    attachToCatalogProduct: false,
  },
  {
    id: "wolverine-bpc157-tb4-10mg-heavy-metals",
    productSlug: "wolverine-bpc157-tb4-10mg",
    productName: "Wolverine BPC-157 / TB4 10mg",
    sku: "WOLVERINE-BPC157-TB4-10MG",
    batchNumber: "Wolverine BPC-157 / TB4 heavy metals",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/wolverine-bpc157-tb4-10mg-heavy-metals.pdf`,
    notes: "Supplier COA document for heavy metals testing.",
    attachToCatalogProduct: false,
  },
  {
    id: "wolverine-bpc157-tb4-10mg-purity",
    productSlug: "wolverine-bpc157-tb4-10mg",
    productName: "Wolverine BPC-157 / TB4 10mg",
    sku: "WOLVERINE-BPC157-TB4-10MG",
    batchNumber: "Wolverine BPC-157 / TB4 purity",
    labName: "Third-party laboratory",
    testedAt: "Document on file",
    purityPercent: null,
    status: "verified",
    documentUrl: `${documentBasePath}/wolverine-bpc157-tb4-10mg-purity.pdf`,
    notes: "Supplier COA document for purity testing.",
    attachToCatalogProduct: false,
  },
];

function normalizeSku(sku: string) {
  return sku.trim().toUpperCase();
}

function toBatch(definition: ApprovedCoaDefinition, productSlug = definition.productSlug): CoaBatch {
  return {
    id: definition.id,
    productSlug,
    productName: definition.productName,
    sku: definition.sku,
    batchNumber: definition.batchNumber,
    labName: definition.labName,
    testedAt: definition.testedAt,
    purityPercent: definition.purityPercent,
    status: definition.status,
    documentUrl: definition.documentUrl,
    notes: definition.notes,
  };
}

function dedupeCoaBatches(batches: CoaBatch[]) {
  const seen = new Set<string>();

  return batches.filter((batch) => {
    const key = batch.documentUrl || batch.id;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function applyApprovedCoaDocuments(products: Product[]) {
  const definitionsBySku = new Map<string, ApprovedCoaDefinition[]>();

  for (const definition of approvedCoaDefinitions) {
    if (!definition.attachToCatalogProduct) {
      continue;
    }

    const sku = normalizeSku(definition.sku);
    definitionsBySku.set(sku, [...(definitionsBySku.get(sku) ?? []), definition]);
  }

  return products.map((product) => {
    const definitions = definitionsBySku.get(normalizeSku(product.sku)) ?? [];

    if (definitions.length === 0) {
      return product;
    }

    const coaBatches = dedupeCoaBatches([
      ...product.coaBatches,
      ...definitions.map((definition) => toBatch(definition, product.slug)),
    ]);

    return { ...product, coaBatches };
  });
}

export function mergeApprovedCoaBatches(
  batches: CoaBatch[],
  products: Product[],
  productSlug?: string,
) {
  const catalogProductBySku = new Map(
    products.map((product) => [normalizeSku(product.sku), product]),
  );
  const approvedBatches = approvedCoaDefinitions.map((definition) => {
    const catalogProduct = definition.attachToCatalogProduct
      ? catalogProductBySku.get(normalizeSku(definition.sku))
      : undefined;

    return toBatch(definition, catalogProduct?.slug);
  });
  const merged = dedupeCoaBatches([...batches, ...approvedBatches]);

  return productSlug
    ? merged.filter((batch) => batch.productSlug === productSlug)
    : merged;
}
