export type VialConfig = {
  apiKey: string;
  apiKeyHeader: string;
  authScheme: string;
  baseUrl: string;
  inventoryPath: string;
  productsPath: string;
  productPath: string;
  ordersPath: string;
  orderPath: string;
  orderByExternalIdPath: string;
  idempotencyHeader: string;
  webhookSecret: string;
};

function cleanEnv(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

function cleanBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getVialConfig(): VialConfig {
  return {
    apiKey: cleanEnv(process.env.VIAL_API_KEY || process.env.PEPTIDE_AMERICA_VIALAPI_KEY),
    apiKeyHeader: cleanEnv(process.env.VIAL_AUTH_HEADER) || "Authorization",
    authScheme: process.env.VIAL_AUTH_SCHEME ?? "Bearer",
    baseUrl: cleanBaseUrl(cleanEnv(process.env.VIAL_API_BASE_URL) || "https://vialapi.com"),
    inventoryPath: cleanEnv(process.env.VIAL_INVENTORY_PATH) || "/api/v1/inventory",
    productsPath: cleanEnv(process.env.VIAL_PRODUCTS_PATH) || "/api/v1/products",
    productPath: cleanEnv(process.env.VIAL_PRODUCT_PATH),
    ordersPath: cleanEnv(process.env.VIAL_ORDERS_PATH) || "/api/v1/orders",
    orderPath: cleanEnv(process.env.VIAL_ORDER_PATH) || "/api/v1/orders/:id",
    orderByExternalIdPath:
      cleanEnv(process.env.VIAL_ORDER_BY_EXTERNAL_ID_PATH) ||
      "/api/v1/orders/by-external-id/:externalOrderId",
    idempotencyHeader: cleanEnv(process.env.VIAL_IDEMPOTENCY_HEADER) || "Idempotency-Key",
    webhookSecret: cleanEnv(process.env.VIAL_WEBHOOK_SECRET),
  };
}

export function isVialCatalogConfigured(config = getVialConfig()) {
  return Boolean(config.apiKey && config.baseUrl && config.productsPath);
}

export function isVialOrdersConfigured(config = getVialConfig()) {
  return Boolean(config.apiKey && config.baseUrl && config.ordersPath);
}
