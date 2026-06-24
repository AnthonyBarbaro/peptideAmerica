# Authorize.Net Accept Hosted

Authorize.Net is wired as a hosted-payment scaffold. The storefront does not collect card data.

## Files

- `src/lib/payment/authorize-net/config.ts`
- `src/lib/payment/authorize-net/hosted.ts`
- `src/lib/payment/authorize-net/webhooks.ts`
- `src/app/api/payment/authorize-net/webhook/route.ts`
- `src/lib/payment/checkout-provider.ts`
- `src/lib/orders/order-ledger.ts`
- `src/app/api/orders/track/route.ts`

## Environment

```bash
PAYMENT_PROVIDER=authorize_net
DATABASE_URL=
DATABASE_SSL=false
AUTHORIZE_NET_ENV=sandbox
AUTHORIZE_NET_API_LOGIN_ID=
AUTHORIZE_NET_TRANSACTION_KEY=
AUTHORIZE_NET_SIGNATURE_KEY=
AUTHORIZE_NET_RETURN_URL=https://peptideamerica.com/checkout
AUTHORIZE_NET_CANCEL_URL=https://peptideamerica.com/checkout
AUTO_SUBMIT_PAID_ORDERS_TO_VIAL=false
```

Use `AUTHORIZE_NET_ENV=production` only after the merchant account and gateway are approved.

## Flow

1. Checkout validates cart, contact, shipping, and attestation.
2. The server creates a pending local order in Postgres, including Clerk user ID when the customer is signed in.
3. The server requests an Accept Hosted payment token from Authorize.Net with `refId` set to the local external order ID.
4. The browser posts that token to Authorize.Net's hosted payment page.
5. Authorize.Net sends webhook notifications to `/api/payment/authorize-net/webhook`.
6. The webhook route verifies `X-ANET-Signature` with HMAC-SHA512.
7. Verified payment events are stored in `payment_events` and paid orders update `commerce_orders`.
8. When `AUTO_SUBMIT_PAID_ORDERS_TO_VIAL=true`, a paid order is submitted to Vial from the stored order snapshot.

## Order Ledger

The app uses `DATABASE_URL` for a Postgres-backed order ledger. Railway Postgres works for this. The server creates these tables if they do not exist:

- `commerce_orders`
- `payment_events`
- `fulfillment_events`

Keep `AUTO_SUBMIT_PAID_ORDERS_TO_VIAL=false` until Authorize.Net production webhooks and Vial order submission have both been tested end to end.

`/track-order` reads from `commerce_orders` by external order ID and customer email, then displays Vial status and tracking when Vial webhooks have populated it.

`/my-account` reads from `commerce_orders` by Clerk user ID and verified account email. Invoice pages under `/my-account/orders/*` are protected by Clerk.
