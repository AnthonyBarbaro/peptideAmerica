import type { CheckoutRequest } from "@/lib/payment/types";
import { getVialConfig, isVialOrdersConfigured } from "./config";
import { VialClient } from "./client";

export type VialOrderResult = {
  id: string;
  externalOrderId: string;
  status?: string;
};

type JsonRecord = Record<string, unknown>;

function getOrderId(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as JsonRecord;
  const nested = record.order && typeof record.order === "object" ? (record.order as JsonRecord) : record;
  const id = nested.id ?? nested.orderId ?? nested.order_id ?? nested.uuid;

  return typeof id === "string" || typeof id === "number" ? String(id) : "";
}

function getOrderStatus(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const record = payload as JsonRecord;
  const status = record.status;

  return typeof status === "string" ? status : undefined;
}

export function canSubmitVialOrders() {
  return isVialOrdersConfigured() && process.env.VIAL_ALLOW_UNPAID_ORDERS === "true";
}

export async function submitVialOrder(
  request: CheckoutRequest,
  options: { paymentApproved?: boolean } = {},
): Promise<VialOrderResult> {
  const config = getVialConfig();

  if (!isVialOrdersConfigured(config)) {
    throw new Error("Vial order endpoint is not configured.");
  }

  if (!options.paymentApproved && process.env.VIAL_ALLOW_UNPAID_ORDERS !== "true") {
    throw new Error("Vial order submission is blocked until payment handling is approved.");
  }

  const externalOrderId = request.clientRequestId || crypto.randomUUID();
  const payload = {
    externalOrderId,
    customer: {
      firstName: request.customer?.firstName,
      lastName: request.customer?.lastName,
      email: request.customer?.email,
      phone: request.customer?.phone,
    },
    shipTo: {
      recipientName: [request.customer?.firstName, request.customer?.lastName]
        .filter(Boolean)
        .join(" "),
      address1: request.shippingAddress?.line1,
      address2: request.shippingAddress?.line2,
      city: request.shippingAddress?.city,
      state: request.shippingAddress?.region,
      postalCode: request.shippingAddress?.postalCode,
      country: request.shippingAddress?.country || "US",
      residential: true,
    },
    lineItems: request.items.map((item) => ({
      sku: item.sku,
      quantity: item.quantity,
    })),
    metadata: {
      source: "peptideamerica",
      attestationAccepted: request.attestationAccepted,
      lineItems: request.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        unitPriceCents: item.priceCents,
      })),
    },
  };

  const response = await new VialClient(config).requestJson<unknown>(config.ordersPath, {
    method: "POST",
    body: JSON.stringify(payload),
    idempotencyKey: externalOrderId,
  });

  return {
    id: getOrderId(response) || externalOrderId,
    externalOrderId,
    status: getOrderStatus(response),
  };
}

export async function getVialOrderById(id: string) {
  const config = getVialConfig();
  const path = config.orderPath.replace(":id", encodeURIComponent(id));

  return new VialClient(config).requestJson<unknown>(path);
}

export async function getVialOrderByExternalId(externalOrderId: string) {
  const config = getVialConfig();
  const path = config.orderByExternalIdPath.replace(
    ":externalOrderId",
    encodeURIComponent(externalOrderId),
  );

  return new VialClient(config).requestJson<unknown>(path);
}
