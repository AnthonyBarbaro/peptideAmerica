import type { Product } from "@/lib/commerce/types";
import { formatDisplaySku } from "@/lib/format";

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

// Display labels are customer-facing and must stay research-only: they
// describe the molecule class (chemistry), never a body system or benefit.
const researchAreaDetails: Record<
  string,
  { label: string; group: string; examples: string; note: string }
> = {
  Cellular: {
    label: "Sequence Peptides",
    group: "Sequence Peptides",
    examples: "BPC-157, TB-500",
    note: "Use this to narrow BPC and TB items.",
  },
  Cofactor: {
    label: "Cofactor Reference",
    group: "Cofactor Reference",
    examples: "NAD+ 1000mg",
    note: "Use this for NAD+ listings.",
  },
  "Copper Complex": {
    label: "Copper Complex Research",
    group: "Copper Complex Research",
    examples: "GHK-CU",
    note: "Use this for copper peptide listings.",
  },
  Glycoprotein: {
    label: "Glycoprotein Research",
    group: "Glycoprotein Research",
    examples: "HCG 10000iu",
    note: "Use this for HCG listings.",
  },
  Metabolic: {
    label: "Peptide Analog Research",
    group: "Peptide Analog Research",
    examples: "AOD 9604, GLP-3",
    note: "Use this for AOD and GLP-3 listings.",
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

// Soft surface per molecule class, used behind product imagery so each card
// reads as a distinct, premium tile. On-brand: shades of the Peptide America
// red / white / blue palette only. Decorative.
const researchAreaTint: Record<string, string> = {
  Cellular: "bg-gradient-to-b from-blue-50 to-blue-100/70",
  Cofactor: "bg-gradient-to-b from-sky-50 to-sky-100/70",
  "Copper Complex": "bg-gradient-to-b from-slate-50 to-slate-100",
  Glycoprotein: "bg-gradient-to-b from-indigo-50 to-indigo-100/60",
  Metabolic: "bg-gradient-to-b from-rose-50 to-rose-100/60",
  "Peptide Blend": "bg-gradient-to-b from-red-50 to-red-100/50",
};

export function getProductSurfaceTint(product: Product) {
  return (
    researchAreaTint[getProductResearchArea(product)] ??
    "bg-gradient-to-b from-slate-50 to-slate-100"
  );
}

export function getProductCardDescriptor(product: Product) {
  const description = product.shortDescription.trim();

  if (!description || description.toLowerCase() === "catalog item imported from vial.") {
    return getProductResearchArea(product);
  }

  return description;
}

const placeholderDescriptions = new Set([
  "",
  "catalog item imported from vial.",
  "catalog item imported from vial",
]);

/**
 * Returns a useful, neutral, research-only product description. Uses the real
 * supplier overview when one exists; otherwise builds a factual catalog
 * description from the product's own data (name, class, size, SKU). Never
 * states a use, outcome, or benefit.
 */
export function getProductResearchDescription(product: Product) {
  const overview = product.researchOverview?.trim() ?? "";

  if (!placeholderDescriptions.has(overview.toLowerCase())) {
    return overview;
  }

  const label = getResearchAreaDetails(getProductResearchArea(product)).label;
  const size = product.sizeLabel?.trim();
  const sizePart = size ? ` supplied in a ${size} vial` : "";
  const docsPart =
    product.coaBatches.length > 0
      ? "The certificate of analysis and batch records for this item are listed below."
      : "Batch documentation is added as it is published.";

  return `${product.name} is a ${label.toLowerCase()} catalog item${sizePart} (${formatDisplaySku(product.sku)}), offered for lawful laboratory research and documentation review only. ${docsPart} Not for human or animal use.`;
}
