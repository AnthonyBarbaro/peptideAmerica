import type { CheckoutRequest } from "@/lib/payment/types";
import type { VialOrderResult } from "@/lib/vial/orders";
import { dbQuery, isDatabaseConfigured } from "../db/postgres";

type JsonRecord = Record<string, unknown>;

type CommerceOrderRow = {
  external_order_id: string;
  status: string;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string | null;
  shipping_address: CheckoutRequest["shippingAddress"];
  items: CheckoutRequest["items"];
  attestation_accepted: boolean;
  amount_cents: number;
  payment_transaction_id: string | null;
  payment_auth_code: string | null;
  payment_event_type: string | null;
  payment_notification_id: string | null;
  vial_order_id: string | null;
  vial_status: string | null;
  tracking: JsonRecord | null;
  created_at: Date;
  updated_at: Date;
  paid_at: Date | null;
  submitted_to_vial_at: Date | null;
};

export type LedgerOrder = {
  externalOrderId: string;
  status: string;
  amountCents: number;
  checkoutRequest: CheckoutRequest;
  paymentTransactionId: string | null;
  vialOrderId: string | null;
  vialStatus: string | null;
  tracking: JsonRecord | null;
};

export type AuthorizeNetWebhookEvent = {
  notificationId?: string;
  eventType?: string;
  eventDate?: string;
  webhookId?: string;
  payload?: {
    responseCode?: string | number;
    merchantReferenceId?: string;
    authCode?: string;
    authAmount?: string | number;
    entityName?: string;
    id?: string | number;
  } & JsonRecord;
};

export type VialFulfillmentEvent = {
  event?: string;
  vialapiOrderId?: string;
  externalOrderId?: string;
  status?: string;
  tracking?: unknown;
};

let ensureTablesPromise: Promise<void> | null = null;

function getText(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function getOrderTotalCents(request: CheckoutRequest) {
  return request.items.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0,
  );
}

function asJsonRecord(value: unknown): JsonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function isApprovedPaymentEvent(event: AuthorizeNetWebhookEvent) {
  return (
    ["net.authorize.payment.authcapture.created", "net.authorize.payment.capture.created"].includes(
      event.eventType ?? "",
    ) && String(event.payload?.responseCode ?? "") === "1"
  );
}

function rowToLedgerOrder(row: CommerceOrderRow): LedgerOrder {
  return {
    externalOrderId: row.external_order_id,
    status: row.status,
    amountCents: row.amount_cents,
    checkoutRequest: {
      clientRequestId: row.external_order_id,
      customer: {
        email: row.customer_email,
        firstName: row.customer_first_name,
        lastName: row.customer_last_name,
        phone: row.customer_phone ?? undefined,
      },
      shippingAddress: row.shipping_address,
      attestationAccepted: row.attestation_accepted,
      items: row.items,
    },
    paymentTransactionId: row.payment_transaction_id,
    vialOrderId: row.vial_order_id,
    vialStatus: row.vial_status,
    tracking: row.tracking,
  };
}

export function isOrderLedgerConfigured() {
  return isDatabaseConfigured();
}

export async function ensureOrderLedgerTables() {
  if (!ensureTablesPromise) {
    ensureTablesPromise = (async () => {
      await dbQuery(`
        create table if not exists commerce_orders (
          external_order_id text primary key,
          status text not null default 'payment_pending',
          customer_email text not null,
          customer_first_name text not null,
          customer_last_name text not null,
          customer_phone text,
          shipping_address jsonb not null,
          items jsonb not null,
          attestation_accepted boolean not null default false,
          amount_cents integer not null,
          payment_provider text,
          payment_transaction_id text,
          payment_auth_code text,
          payment_event_type text,
          payment_notification_id text,
          vial_order_id text,
          vial_status text,
          tracking jsonb,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          paid_at timestamptz,
          submitted_to_vial_at timestamptz
        )
      `);

      await dbQuery(`
        create table if not exists payment_events (
          notification_id text primary key,
          external_order_id text,
          event_type text,
          transaction_id text,
          response_code text,
          payload jsonb not null,
          received_at timestamptz not null default now()
        )
      `);

      await dbQuery(`
        create table if not exists fulfillment_events (
          delivery_id text primary key,
          external_order_id text,
          event_type text,
          vialapi_order_id text,
          status text,
          tracking jsonb,
          payload jsonb not null,
          received_at timestamptz not null default now()
        )
      `);

      await dbQuery(
        "create index if not exists commerce_orders_customer_email_idx on commerce_orders (customer_email)",
      );
      await dbQuery(
        "create index if not exists commerce_orders_payment_transaction_idx on commerce_orders (payment_transaction_id)",
      );
    })();
  }

  return ensureTablesPromise;
}

export async function createPendingOrder(request: CheckoutRequest) {
  if (!request.clientRequestId) {
    throw new Error("Checkout request is missing an external order ID.");
  }

  if (!request.customer || !request.shippingAddress) {
    throw new Error("Checkout request is missing customer or shipping details.");
  }

  await ensureOrderLedgerTables();

  await dbQuery(
    `
      insert into commerce_orders (
        external_order_id,
        status,
        customer_email,
        customer_first_name,
        customer_last_name,
        customer_phone,
        shipping_address,
        items,
        attestation_accepted,
        amount_cents,
        payment_provider,
        updated_at
      )
      values ($1, 'payment_pending', $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, 'authorize_net', now())
      on conflict (external_order_id) do update set
        customer_email = excluded.customer_email,
        customer_first_name = excluded.customer_first_name,
        customer_last_name = excluded.customer_last_name,
        customer_phone = excluded.customer_phone,
        shipping_address = excluded.shipping_address,
        items = excluded.items,
        attestation_accepted = excluded.attestation_accepted,
        amount_cents = excluded.amount_cents,
        updated_at = now()
      where commerce_orders.status in ('payment_pending', 'payment_failed')
    `,
    [
      request.clientRequestId,
      request.customer.email,
      request.customer.firstName,
      request.customer.lastName,
      request.customer.phone ?? null,
      JSON.stringify(request.shippingAddress),
      JSON.stringify(request.items),
      request.attestationAccepted,
      getOrderTotalCents(request),
    ],
  );
}

export async function getOrderByExternalId(externalOrderId: string) {
  await ensureOrderLedgerTables();

  const result = await dbQuery<CommerceOrderRow>(
    "select * from commerce_orders where external_order_id = $1 limit 1",
    [externalOrderId],
  );

  return result.rows[0] ? rowToLedgerOrder(result.rows[0]) : null;
}

export async function recordAuthorizeNetPaymentEvent(event: AuthorizeNetWebhookEvent) {
  await ensureOrderLedgerTables();

  const payload = asJsonRecord(event.payload) ?? {};
  const externalOrderId = getText(payload.merchantReferenceId);
  const transactionId = getText(payload.id);
  const responseCode = getText(payload.responseCode);
  const notificationId = getText(event.notificationId) || crypto.randomUUID();
  const eventType = getText(event.eventType);
  const authCode = getText(payload.authCode);

  await dbQuery(
    `
      insert into payment_events (
        notification_id,
        external_order_id,
        event_type,
        transaction_id,
        response_code,
        payload
      )
      values ($1, $2, $3, $4, $5, $6::jsonb)
      on conflict (notification_id) do nothing
    `,
    [
      notificationId,
      externalOrderId || null,
      eventType || null,
      transactionId || null,
      responseCode || null,
      JSON.stringify(event),
    ],
  );

  if (externalOrderId && isApprovedPaymentEvent(event)) {
    await dbQuery(
      `
        update commerce_orders set
          status = case
            when status = 'submitted_to_vial' then status
            else 'paid'
          end,
          payment_transaction_id = $2,
          payment_auth_code = $3,
          payment_event_type = $4,
          payment_notification_id = $5,
          paid_at = coalesce(paid_at, now()),
          updated_at = now()
        where external_order_id = $1
      `,
      [externalOrderId, transactionId || null, authCode || null, eventType || null, notificationId],
    );
  }

  return {
    approved: isApprovedPaymentEvent(event),
    externalOrderId,
    transactionId,
  };
}

export async function markOrderSubmittedToVial(
  externalOrderId: string,
  order: VialOrderResult,
) {
  await ensureOrderLedgerTables();

  await dbQuery(
    `
      update commerce_orders set
        status = 'submitted_to_vial',
        vial_order_id = $2,
        vial_status = $3,
        submitted_to_vial_at = coalesce(submitted_to_vial_at, now()),
        updated_at = now()
      where external_order_id = $1
    `,
    [externalOrderId, order.id, order.status ?? null],
  );
}

export async function markOrderVialSubmissionFailed(
  externalOrderId: string,
  message: string,
) {
  await ensureOrderLedgerTables();

  await dbQuery(
    `
      update commerce_orders set
        status = 'vial_submission_failed',
        vial_status = $2,
        updated_at = now()
      where external_order_id = $1
    `,
    [externalOrderId, message],
  );
}

export async function recordVialFulfillmentEvent({
  deliveryId,
  event,
}: {
  deliveryId: string;
  event: VialFulfillmentEvent;
}) {
  await ensureOrderLedgerTables();

  const tracking = asJsonRecord(event.tracking);
  const eventName = getText(event.event);
  const externalOrderId = getText(event.externalOrderId);
  const vialapiOrderId = getText(event.vialapiOrderId);
  const status = getText(event.status);

  await dbQuery(
    `
      insert into fulfillment_events (
        delivery_id,
        external_order_id,
        event_type,
        vialapi_order_id,
        status,
        tracking,
        payload
      )
      values ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)
      on conflict (delivery_id) do nothing
    `,
    [
      deliveryId,
      externalOrderId || null,
      eventName || null,
      vialapiOrderId || null,
      status || null,
      tracking ? JSON.stringify(tracking) : null,
      JSON.stringify(event),
    ],
  );

  if (externalOrderId) {
    await dbQuery(
      `
        update commerce_orders set
          status = $2,
          vial_order_id = coalesce($3, vial_order_id),
          vial_status = coalesce($4, vial_status),
          tracking = coalesce($5::jsonb, tracking),
          updated_at = now()
        where external_order_id = $1
      `,
      [
        externalOrderId,
        status ? `vial_${status}` : "fulfillment_updated",
        vialapiOrderId || null,
        status || null,
        tracking ? JSON.stringify(tracking) : null,
      ],
    );
  }
}
