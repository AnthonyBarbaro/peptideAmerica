# Peptide America

Phase 1 builds a production-ready Next.js frontend for PeptideAmerica.com using mock commerce data. The app is Vercel-ready and does not connect to WooCommerce, payments, or ShipStation yet.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand cart state
- Framer Motion
- Lucide icons
- Radix UI dialogs and accordions
- Zod route validation
- GraphQL Yoga internal API route

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` for local overrides. Phase 1 defaults to:

```bash
COMMERCE_PROVIDER=mock
CHECKOUT_MODE=disabled
PAYMENT_PROVIDER=woocommerce_redirect
SHIPSTATION_MODE=woocommerce_plugin
```

Never expose `WOOCOMMERCE_CONSUMER_SECRET` or future payment secrets to client components.

## Phase 1 Features

- Homepage with CSS/SVG biotech visual system
- Shop grid with search, category filter, sorting, and quick add
- Product detail pages with specs, COA records, and one compliance card
- Research library with neutral catalog education articles
- Site search across products, sample COA records, and research articles
- Zustand cart with persisted line items
- Checkout validation with required attestation
- Searchable COA library with sample/mock batch records
- FAQ, contact form UI, and placeholder policy pages
- Accessibility panel with persisted preferences
- REST API routes and internal GraphQL route backed by the same provider
- Sitemap, robots, JSON-LD, and SEO metadata
- Content compliance scanner

## Public Routes

- `/`
- `/shop`
- `/shop/[slug]`
- `/coa`
- `/research-library`
- `/research-library/[slug]`
- `/cart`
- `/checkout`
- `/search`
- `/faq`
- `/contact`
- `/policies/research-use-only`
- `/policies/privacy`
- `/policies/terms`
- `/policies/shipping-returns`

## QA

```bash
npm run lint
npm run typecheck
npm run test
npm run check:content
npm run build
```

`npm run qa` runs lint, typecheck, Vitest, and content checks.

## Compliance

Displayed storefront copy is kept neutral and catalog-focused. Research-use-only messaging appears only in the global banner, the product detail compliance card, and the checkout attestation checkbox.
