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

export function getProductCardDescriptor(product: Product) {
  const description = product.shortDescription.trim();

  if (!description || description.toLowerCase() === "catalog item imported from vial.") {
    return getProductResearchArea(product);
  }

  return description;
}
