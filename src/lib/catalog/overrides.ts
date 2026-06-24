import type { Product, TechnicalSpec } from "@/lib/commerce/types";
import { catalogOverrides } from "../../data/catalog-overrides";

export type CatalogProductOverride = {
  priceCents?: number;
  category?: string;
  sizeLabel?: string;
  shortDescription?: string;
  researchOverview?: string;
  purityLabel?: string;
  storageLabel?: string;
  molecularWeight?: string;
  sequence?: string;
  tags?: string[];
  images?: string[];
  technicalSpecs?: TechnicalSpec[];
};

export type CatalogOverrides = Record<string, CatalogProductOverride>;

function normalizeSku(sku: string) {
  return sku.trim().toUpperCase();
}

function cleanPriceCents(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.round(value))
    : undefined;
}

export function applyCatalogOverrides(
  products: Product[],
  overrides: CatalogOverrides = catalogOverrides,
) {
  const overridesBySku = new Map(
    Object.entries(overrides).map(([sku, override]) => [normalizeSku(sku), override]),
  );

  return products.map((product) => {
    const override = overridesBySku.get(normalizeSku(product.sku));

    if (!override) {
      return product;
    }

    const priceCents = cleanPriceCents(override.priceCents);

    return {
      ...product,
      priceCents: priceCents ?? product.priceCents,
      category: override.category ?? product.category,
      sizeLabel: override.sizeLabel ?? product.sizeLabel,
      shortDescription: override.shortDescription ?? product.shortDescription,
      researchOverview: override.researchOverview ?? product.researchOverview,
      purityLabel: override.purityLabel ?? product.purityLabel,
      storageLabel: override.storageLabel ?? product.storageLabel,
      molecularWeight: override.molecularWeight ?? product.molecularWeight,
      sequence: override.sequence ?? product.sequence,
      tags: override.tags ?? product.tags,
      images: override.images ?? product.images,
      technicalSpecs: override.technicalSpecs ?? product.technicalSpecs,
    };
  });
}
