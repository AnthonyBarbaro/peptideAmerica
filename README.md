# Peptide America

Peptide America is a Next.js storefront wired for a Vial-backed catalog and guarded order handoff. WooCommerce is not part of the active integration path.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand cart state
- Clerk authentication
- Authorize.Net hosted payment scaffold
- Framer Motion
- Lucide icons
- Radix UI dialogs and accordions
- Zod route validation
- GraphQL Yoga internal API route
- Vial API adapter for catalog, COA records, and order submission

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` for local overrides. Vial catalog data is required for live products:

```bash
VIAL_API_BASE_URL=https://vialapi.com
VIAL_API_KEY=
VIAL_PRODUCTS_PATH=
VIAL_PRODUCT_PATH=
VIAL_ORDERS_PATH=
PAYMENT_PROVIDER=disabled
AUTHORIZE_NET_ENV=sandbox
AUTHORIZE_NET_API_LOGIN_ID=
AUTHORIZE_NET_TRANSACTION_KEY=
AUTHORIZE_NET_SIGNATURE_KEY=
AUTHORIZE_NET_RETURN_URL=https://peptideamerica.com/checkout
AUTHORIZE_NET_CANCEL_URL=https://peptideamerica.com/checkout
CHECKOUT_MODE=disabled
VIAL_ALLOW_UNPAID_ORDERS=false
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Never expose `VIAL_API_KEY`, `CLERK_SECRET_KEY`, `AUTHORIZE_NET_TRANSACTION_KEY`, or `AUTHORIZE_NET_SIGNATURE_KEY` to client components.

## Features

- Homepage with CSS/SVG biotech visual system
- Shop grid with search, category filter, sorting, and quick add
- Product detail pages with specs, COA records, and one compliance card
- Research library with neutral catalog education articles
- Site search across products, COA records, and research articles
- Zustand cart with persisted line items
- My Account page powered by Clerk sign-in, sign-up, OAuth, and user profile components
- Checkout validation with required attestation
- Searchable COA library backed by the commerce provider
- FAQ, contact form UI, and policy pages
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
- `/my-account`
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

## Live Readiness

Before accepting orders, confirm Vial endpoint paths and payload shape, configure Clerk OAuth providers, configure Authorize.Net webhooks, add reviewed policy copy, connect support email handling, and approve the payment/order workflow. `CHECKOUT_MODE=vial_order` still refuses to submit orders unless `VIAL_ALLOW_UNPAID_ORDERS=true` is set deliberately.
