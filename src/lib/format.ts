export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export const CATALOG_FALLBACK_PRICE_CENTS = 9998;

export function getCatalogPriceCents(cents: number) {
  return cents > 0 ? cents : CATALOG_FALLBACK_PRICE_CENTS;
}

export function formatCatalogPrice(cents: number) {
  return formatMoney(getCatalogPriceCents(cents));
}

// Display-only SKU branding. The real SKU (e.g. RETATRUTIDE-20MG) is still sent
// to Vial for inventory, COA matching, and checkout; only what the shopper sees
// is rebranded.
export function formatDisplaySku(sku: string) {
  return sku.replace(/RETATRUTIDE/gi, "GLP-3");
}

export function formatStockStatus(status: string) {
  switch (status) {
    case "in_stock":
      return "In stock";
    case "low_stock":
      return "Low stock";
    case "out_of_stock":
      return "Out of stock";
    default:
      return status;
  }
}

export function stockStatusBadgeClassName(status: string) {
  switch (status) {
    case "in_stock":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "low_stock":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "out_of_stock":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
