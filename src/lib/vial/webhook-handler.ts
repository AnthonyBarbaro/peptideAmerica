import { NextResponse } from "next/server";
import {
  isOrderLedgerConfigured,
  recordVialFulfillmentEvent,
} from "../orders/order-ledger";
import { verifyVialWebhookSignature } from "./webhooks";

type VialWebhookEvent = {
  event?: string;
  vialapiOrderId?: string;
  externalOrderId?: string;
  status?: string;
  tracking?: unknown;
};

export async function handleVialWebhook(request: Request) {
  const body = await request.text();
  const timestamp = request.headers.get("x-vialapi-timestamp");
  const signatureHeader = request.headers.get("x-vialapi-signature");

  if (!verifyVialWebhookSignature({ body, timestamp, signatureHeader })) {
    return NextResponse.json(
      { ok: false, message: "Invalid VialAPI signature." },
      { status: 401 },
    );
  }

  let event: VialWebhookEvent;

  try {
    event = JSON.parse(body) as VialWebhookEvent;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid VialAPI webhook JSON." },
      { status: 400 },
    );
  }

  console.info("VialAPI webhook received", {
    event: event.event ?? request.headers.get("x-vialapi-event"),
    vialapiOrderId: event.vialapiOrderId,
    externalOrderId: event.externalOrderId,
    status: event.status,
    delivery: request.headers.get("x-vialapi-delivery"),
  });

  const deliveryId = request.headers.get("x-vialapi-delivery");

  if (deliveryId && isOrderLedgerConfigured()) {
    await recordVialFulfillmentEvent({
      deliveryId,
      event: {
        ...event,
        event: event.event ?? request.headers.get("x-vialapi-event") ?? undefined,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
