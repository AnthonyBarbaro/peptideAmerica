import { NextResponse } from "next/server";
import {
  getOrderByExternalId,
  isOrderLedgerConfigured,
} from "@/lib/orders/order-ledger";

export const runtime = "nodejs";

function normalize(value: string | null) {
  return value?.trim() ?? "";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const externalOrderId = normalize(
    url.searchParams.get("externalOrderId") ?? url.searchParams.get("orderNumber"),
  );
  const email = normalize(url.searchParams.get("email")).toLowerCase();

  if (!isOrderLedgerConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Order tracking is not configured." },
      { status: 503 },
    );
  }

  if (!externalOrderId || !email) {
    return NextResponse.json(
      { ok: false, message: "Order number and email are required." },
      { status: 400 },
    );
  }

  const order = await getOrderByExternalId(externalOrderId);

  if (!order || order.checkoutRequest.customer?.email.toLowerCase() !== email) {
    return NextResponse.json(
      { ok: false, message: "No matching order was found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    order: {
      externalOrderId: order.externalOrderId,
      status: order.status,
      amountCents: order.amountCents,
      paymentTransactionId: order.paymentTransactionId,
      vialOrderId: order.vialOrderId,
      vialStatus: order.vialStatus,
      tracking: order.tracking,
      items: order.checkoutRequest.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
      })),
    },
  });
}
