export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatCatalogPrice(cents: number) {
  return cents > 0 ? formatMoney(cents) : "Price pending";
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
