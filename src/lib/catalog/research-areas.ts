import type { Product } from "@/lib/commerce/types";

const genericCatalogAreas = new Set(["", "catalog"]);

const researchAreaBySku: Record<string, string> = {
  "AOD9604-10MG": "Metabolic",
  "BPC157-10MG": "Cellular",
  "BPC157-5MG": "Cellular",
  "GHKCU-50MG": "Copper Complex",
  "GLOW-70MG": "Peptide Blend",
  "HCG-10000IU": "Glycoprotein",
  "NAD-1000MG": "Cofactor",
  "RETATRUTIDE-20MG": "Metabolic",
  "RETATRUTIDE-30MG": "Metabolic",
  "TB500-10MG": "Cellular",
  "TB500-5MG": "Cellular",
};

const researchAreaAliases: Record<string, string> = {
  "actin-binding peptide research": "Cellular",
  "cell signaling research": "Cellular",
  "cellular peptide": "Cellular",
  "copper peptide": "Copper Complex",
  "copper peptide research": "Copper Complex",
  "glycoprotein hormone research": "Glycoprotein",
  "incretin receptor research": "Metabolic",
  "metabolic pathway research": "Metabolic",
  "metabolic research": "Metabolic",
  "peptide blend research": "Peptide Blend",
  "redox cofactor research": "Cofactor",
};

const researchAreaDetails: Record<
  string,
  { label: string; group: string; examples: string; note: string }
> = {
  Cellular: {
    label: "Tissue Repair Research",
    group: "Tissue Repair Research",
    examples: "BPC-157, TB-500",
    note: "Use this to narrow BPC and TB items.",
  },
  Cofactor: {
    label: "Cellular Research",
    group: "Cellular Research",
    examples: "NAD+ 1000mg",
    note: "Use this for NAD+ listings.",
  },
  "Copper Complex": {
    label: "Dermal Research",
    group: "Dermal Research",
    examples: "GHK-CU",
    note: "Use this for copper peptide listings.",
  },
  Glycoprotein: {
    label: "Endocrine Research",
    group: "Endocrine Research",
    examples: "HCG 10000iu",
    note: "Use this for HCG listings.",
  },
  Metabolic: {
    label: "Metabolic Research",
    group: "Metabolic Research",
    examples: "AOD 9604, Retatrutide",
    note: "Use this for AOD and Retatrutide listings.",
  },
  "Peptide Blend": {
    label: "Peptide Blend Research",
    group: "Peptide Blend Research",
    examples: "GLOW",
    note: "Use this for blend listings.",
  },
};

export function getProductResearchArea(product: Product) {
  const skuArea = researchAreaBySku[product.sku.toUpperCase()];

  if (skuArea) {
    return skuArea;
  }

  const category = product.category.trim();
  const normalized = category.toLowerCase();

  if (researchAreaAliases[normalized]) {
    return researchAreaAliases[normalized];
  }

  if (genericCatalogAreas.has(normalized)) {
    return "Catalog";
  }

  return category;
}

export function getResearchAreaDetails(area: string) {
  return (
    researchAreaDetails[area] ?? {
      label: area,
      group: "Catalog focus",
      examples: area,
      note: `Use this for ${area} listings.`,
    }
  );
}

export function getProductCardDescriptor(product: Product) {
  const description = product.shortDescription.trim();

  if (!description || description.toLowerCase() === "catalog item imported from vial.") {
    return getProductResearchArea(product);
  }

  return description;
}
