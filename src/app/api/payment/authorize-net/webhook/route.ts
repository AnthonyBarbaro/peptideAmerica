import { NextResponse } from "next/server";
import {
  type AuthorizeNetWebhookEvent,
  getOrderByExternalId,
  markOrderSubmittedToVial,
  markOrderVialSubmissionFailed,
  recordAuthorizeNetPaymentEvent,
} from "@/lib/orders/order-ledger";
import { verifyAuthorizeNetWebhookSignature } from "@/lib/payment/authorize-net/webhooks";
import { submitVialOrder } from "@/lib/vial/orders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signatureHeader = request.headers.get("x-anet-signature");

  if (!verifyAuthorizeNetWebhookSignature({ body, signatureHeader })) {
    return NextResponse.json(
      { ok: false, message: "Invalid Authorize.Net signature." },
      { status: 401 },
    );
  }

  let event: AuthorizeNetWebhookEvent;

  try {
    event = JSON.parse(body) as AuthorizeNetWebhookEvent;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid Authorize.Net webhook JSON." },
      { status: 400 },
    );
  }

  console.info("Authorize.Net webhook received", {
    eventType: event.eventType,
    notificationId: event.notificationId,
  });

  const paymentEvent = await recordAuthorizeNetPaymentEvent(event);
  let vialSubmission: "skipped" | "submitted" | "failed" = "skipped";

  if (
    paymentEvent.approved &&
    paymentEvent.externalOrderId &&
    process.env.AUTO_SUBMIT_PAID_ORDERS_TO_VIAL === "true"
  ) {
    const order = await getOrderByExternalId(paymentEvent.externalOrderId);

    if (order && order.status !== "submitted_to_vial") {
      try {
        const vialOrder = await submitVialOrder(order.checkoutRequest, {
          paymentApproved: true,
        });
        await markOrderSubmittedToVial(order.externalOrderId, vialOrder);
        vialSubmission = "submitted";
      } catch (error) {
        await markOrderVialSubmissionFailed(
          paymentEvent.externalOrderId,
          error instanceof Error ? error.message : "Vial submission failed.",
        );
        vialSubmission = "failed";
      }
    }
  }

  return NextResponse.json({ ok: true, vialSubmission });
}
