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

Create a second Railway service from this repository and deploy it with the
Directus Dockerfile.

Required variables:

```bash
RAILWAY_DOCKERFILE_PATH=directus/Dockerfile
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
node cli.js bootstrap
node cli.js database migrate:latest
node cli.js start
```

This creates Directus system tables, creates the initial admin user when
`ADMIN_EMAIL` and `ADMIN_PASSWORD` are set, and applies the commerce/admin
migrations in `directus/migrations/`. The second custom migration registers the
commerce tables as Directus collections so they appear in the Content sidebar.

## Admin Access

Use the Directus service URL directly for admin access. The storefront no longer
ships a custom Next.js admin page.

## Collections To Use

In Directus Data Studio:

- Edit `catalog_product_overrides` for retail price, private cost, copy, and
  storefront flags. Attach product images directly on the product row with
  `Primary Product Image`, `Secondary Product Image`, and `Tertiary Product Image`.
- Edit `catalog_product_images` for product images. Use the exact Vial SKU in
  `sku`, put the public image URL in `image_url`, and use `sort_order` to control
  display order. This collection remains available for URL-based images, but
  the direct upload fields on `catalog_product_overrides` are preferred.
- Keep `commerce_orders`, `payment_events`, and `fulfillment_events` read-only
  for normal staff roles.

Recommended role policy:

- Owner/admin: full access.
- Catalog manager: create/update `catalog_product_overrides` and
  `catalog_product_images`; read orders and events.
- Support: read orders and events only.

## Product Workflow

1. Vial adds or updates a SKU.
2. The storefront startup command runs `npm run catalog:sync` behavior before
   `next start`, creating or updating one `catalog_product_overrides` row per
   Vial SKU.
3. Directus edits the synced row for retail price, cost, copy, featured/hidden
   flags, and internal notes.
4. Optional photos are added in `catalog_product_images` using the same SKU.
5. The storefront immediately uses those overrides on the next server render.

Run the sync manually any time with:

```bash
npm run catalog:sync
```

The sync preserves existing retail price, cost, product copy, flags, notes, and
images. It only fills missing editable fields and refreshes Vial metadata such
as product name, slug, stock status, and last sync time.

Use `Retail Price ($)` for the public storefront price and `Private Cost ($)`
for internal cost. The old cents fields remain hidden for compatibility with
older order/catalog code.

To render Directus-uploaded images on the storefront, set this variable on the
Next.js storefront service:

```bash
DIRECTUS_PUBLIC_URL=https://your-directus-domain
```

The Directus migration grants public read access to `directus_files` so uploaded
product images can render through `/assets/<file-id>`. Treat uploaded product
images as public website assets.

If the database is unreachable, the storefront falls back to the Vial catalog
without local overrides.
