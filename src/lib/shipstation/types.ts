export type ShipStationMode = "woocommerce_plugin" | "direct_api";

export type FulfillmentOrder = {
  orderId: string;
  lineItems: Array<{
    sku: string;
    name: string;
    quantity: number;
  }>;
  mode: ShipStationMode;
};
