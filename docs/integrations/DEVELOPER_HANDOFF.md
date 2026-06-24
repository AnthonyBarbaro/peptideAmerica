# Peptide America Developer Handoff

Last updated: 2026-06-24

## Current Direction

Peptide America is now a Vial-first Next.js storefront. Mock storefront data and WooCommerce adapters have been removed from the active code path.

The storefront should only display products returned by the Vial catalog adapter. If Vial is not configured, product lists are empty so the app does not silently publish fake catalog data.

## Current Stack

- Next.js 16.2.9 with App Router and Turbopack
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand cart state
- Vitest
- GraphQL Yoga internal API route
- Clerk authentication
- Authorize.Net Accept Hosted payment scaffold
- Vial API adapter under `src/lib/vial`

## Active Integration Points

- `src/lib/commerce/provider.ts` resolves to the Vial commerce provider.
- `src/lib/vial/client.ts` handles authenticated Vial JSON requests.
- `src/lib/vial/mapper.ts` normalizes Vial catalog payloads into the storefront `Product` model.
- `src/lib/vial/provider.ts` powers shop, product detail, COA, REST, sitemap, and GraphQL reads.
- `src/lib/vial/orders.ts` builds guarded Vial order payloads.
- `src/data/catalog-overrides.ts` overlays approved storefront pricing and display fields by Vial SKU.
- `src/lib/payment/checkout-provider.ts` creates Authorize.Net hosted payment sessions and blocks direct Vial submission unless Vial order env vars and order approval are explicitly configured.
- `src/lib/orders/order-ledger.ts` persists checkout snapshots, payment events, Vial submission status, and Vial fulfillment webhooks in Postgres.
- `/my-account` shows Clerk-backed order history, tracking, and invoice links from the Postgres order ledger.
- `/my-account/orders/[externalOrderId]/invoice` renders protected customer invoices.
- `/track-order` uses `/api/orders/track` to read the live order ledger by order number and email.

## Required Environment

```bash
NEXT_PUBLIC_SITE_URL=https://peptideamerica.com
NEXT_PUBLIC_BRAND_NAME="Peptide America"
VIAL_API_BASE_URL=https://vialapi.com
VIAL_API_KEY=
VIAL_AUTH_HEADER=Authorization
VIAL_AUTH_SCHEME=Bearer
VIAL_INVENTORY_PATH=/api/v1/inventory
VIAL_PRODUCTS_PATH=/api/v1/products
VIAL_PRODUCT_PATH=
VIAL_ORDERS_PATH=/api/v1/orders
VIAL_ORDER_PATH=/api/v1/orders/:id
VIAL_ORDER_BY_EXTERNAL_ID_PATH=/api/v1/orders/by-external-id/:externalOrderId
VIAL_IDEMPOTENCY_HEADER=Idempotency-Key
VIAL_WEBHOOK_SECRET=
DATABASE_URL=
DATABASE_SSL=false
PAYMENT_PROVIDER=disabled
AUTHORIZE_NET_ENV=sandbox
AUTHORIZE_NET_API_LOGIN_ID=
AUTHORIZE_NET_TRANSACTION_KEY=
AUTHORIZE_NET_SIGNATURE_KEY=
AUTHORIZE_NET_RETURN_URL=https://peptideamerica.com/checkout
AUTHORIZE_NET_CANCEL_URL=https://peptideamerica.com/checkout
AUTO_SUBMIT_PAID_ORDERS_TO_VIAL=false
CHECKOUT_MODE=disabled
VIAL_ALLOW_UNPAID_ORDERS=false
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Do not expose `VIAL_API_KEY` to client components.

## Launch Blockers

1. Set `VIAL_WEBHOOK_SECRET` from the Vial portal signing secret. The API key is not the webhook signing secret.
2. Provision Railway Postgres, set `DATABASE_URL`, and run `npm run db:setup`.
3. Deploy Directus from `directus/` and use that Directus URL for admin access.
4. Configure Authorize.Net production credentials and webhook URL.
5. Keep `VIAL_ALLOW_UNPAID_ORDERS=false` unless payment is handled by an approved external process.
6. Keep `AUTO_SUBMIT_PAID_ORDERS_TO_VIAL=false` until one sandbox payment webhook has marked an order paid and one test Vial order has been reviewed.
7. After testing, set `AUTO_SUBMIT_PAID_ORDERS_TO_VIAL=true` to submit paid orders to Vial automatically.
8. Configure Clerk production keys and approved OAuth providers.
9. Connect the contact/newsletter forms to real storage or support tooling.
10. Finalize privacy, return, shipping, terms, and research-use policy copy with legal/compliance review.
11. Run full QA and production smoke testing before opening checkout.

## Verification Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run check:content
npm run db:setup
npm run build
```

## Notes

- WooCommerce is not used.
- Mock storefront product data is not used.
- Directus is the primary business admin for product overrides, product images,
  private cost, and order review. See `docs/integrations/directus-admin.md`.
- Unpriced products display `Price pending` and cannot be added to cart.
- Checkout does not collect card data in Next.js.
- Account login is handled by Clerk, not by custom password code.
- Signed-in checkout stores `clerk_user_id` on `commerce_orders`; account history also falls back to verified account emails for older rows.
- Authorize.Net webhook verification and Postgres order logging exist.
- Railway Postgres works through `DATABASE_URL`. `postgres.railway.internal`
  hostnames only resolve inside Railway; use Railway CLI variables or the public
  Postgres connection URL for local database setup.
- `/track-order` requires `DATABASE_URL`; without it the API returns a 503 configuration response.
- COA and product values should come from Vial or approved supplier records.
