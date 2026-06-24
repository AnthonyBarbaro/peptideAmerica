# Directus Admin

Directus is the primary business admin for product presentation, pricing,
private cost, product photos, and order review. The storefront still reads
directly from Postgres and Vial; public pages do not depend on the Directus API
being online.

## Architecture

- Vial remains the source for live catalog SKUs, names, inventory, and
  fulfillment updates.
- Directus manages local Postgres admin tables:
  - `catalog_product_overrides` for price, private cost, marketing copy, hidden
    state, featured state, tags, and internal notes.
  - `catalog_product_images` for product image URLs managed row-by-row.
  - `commerce_orders`, `payment_events`, and `fulfillment_events` for order,
    payment, and tracking review.
- Next.js overlays `catalog_product_overrides` and `catalog_product_images` on
  top of the Vial catalog.

## Railway Service

Create a second Railway service from the `directus/` folder and deploy it with
Docker.

Required variables:

```bash
KEY=<random 32+ character secret>
SECRET=<random 32+ character secret>
PUBLIC_URL=https://admin.peptideamerica.com
DB_CLIENT=pg
DB_CONNECTION_STRING=${{Postgres.DATABASE_URL}}
ADMIN_EMAIL=anthony@barbaro.tech
ADMIN_PASSWORD=<temporary strong password>
TELEMETRY=false
```

Use Railway's private Postgres URL for `DB_CONNECTION_STRING` when Directus runs
inside Railway. If using a public Postgres URL, add SSL settings as required by
the database provider:

```bash
DB_SSL__REJECT_UNAUTHORIZED=false
```

The `directus/Dockerfile` runs:

```bash
directus bootstrap
directus database migrate:latest
directus start
```

This creates Directus system tables, creates the initial admin user when
`ADMIN_EMAIL` and `ADMIN_PASSWORD` are set, and applies the commerce/admin
migration in `directus/migrations/`.

## Admin Access

Use the Directus service URL directly for admin access. The storefront no longer
ships a custom Next.js admin page.

## Collections To Use

In Directus Data Studio:

- Edit `catalog_product_overrides` for retail price, private cost, copy, and
  storefront flags.
- Edit `catalog_product_images` for product images. Use the exact Vial SKU in
  `sku`, put the public image URL in `image_url`, and use `sort_order` to control
  display order.
- Keep `commerce_orders`, `payment_events`, and `fulfillment_events` read-only
  for normal staff roles.

Recommended role policy:

- Owner/admin: full access.
- Catalog manager: create/update `catalog_product_overrides` and
  `catalog_product_images`; read orders and events.
- Support: read orders and events only.

## Product Workflow

1. Vial adds or updates a SKU.
2. Next.js loads that SKU from Vial.
3. Directus creates or edits a matching `catalog_product_overrides` row using the
   same SKU.
4. Optional photos are added in `catalog_product_images` using the same SKU.
5. The storefront immediately uses those overrides on the next server render.

If the database is unreachable, the storefront falls back to the Vial catalog
without local overrides.
