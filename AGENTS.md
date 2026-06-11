# Peptide America Agent Guide

This repo is the Phase 1 Next.js frontend for PeptideAmerica.com. Agents must preserve the mock-provider-first architecture and avoid connecting WooCommerce, payments, or ShipStation until a later phase.

## Design Agent

Checks visual quality, mobile layout, colors, spacing, and animations.

Acceptance criteria:
- Dark navy, white, and red accent palette is consistent.
- Layouts work at mobile, tablet, and desktop widths.
- UI uses CSS/SVG/placeholder visuals only in Phase 1.
- Motion is tasteful and respects reduced-motion preferences.
- Cards, controls, and typography feel polished without marketing clutter.

## Frontend Agent

Checks components, routing, cart, product pages, state, and forms.

Acceptance criteria:
- Required Phase 1 routes render: `/`, `/shop`, `/shop/[slug]`, `/cart`, `/checkout`, `/coa`.
- Product cards, product pages, cart actions, and checkout validation work.
- Zustand cart state persists in localStorage.
- Client components are used only where interaction is required.
- Forms use real inputs, labels, buttons, and accessible states.

## Commerce Integration Agent

Checks mock provider, REST routes, GraphQL route, and future Woo adapters.

Acceptance criteria:
- Frontend, REST routes, and GraphQL route use `getCommerceProvider()`.
- `COMMERCE_PROVIDER=mock` works without backend services.
- WooCommerce REST and WPGraphQL/WooGraphQL files remain adapter placeholders.
- Checkout provider never collects card data in Next.js.
- Future secrets stay server-side only.

## Compliance/Content Agent

Checks no prohibited claims, no prohibited use language, and no repetitive disclaimers.

Acceptance criteria:
- No medical, dosing, administration, human-use, animal-use, outcome, or performance claims.
- Product and COA values are clearly sample/mock until supplier data is provided.
- Compliance messaging appears only in the top banner, product detail compliance card, and checkout attestation checkbox.
- `npm run check:content` passes.

## Accessibility/SEO Agent

Checks keyboard operation, metadata, sitemap, robots, JSON-LD, contrast, and reduced motion.

Acceptance criteria:
- Skip-to-content link works.
- Focus rings are visible.
- `/` opens search unless the user is typing.
- Escape closes dialogs.
- Nav, search, cart, filters, and checkout controls are keyboard usable.
- Accessibility preferences persist and apply to the document.
- `app/sitemap.ts`, `app/robots.ts`, metadata, and JSON-LD are present.

## QA Agent

Runs lint, typecheck, unit tests, Playwright tests, and summarizes failures.

Acceptance criteria:
- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run test` when tests are in scope.
- Run `npm run test:e2e` when browser checks are in scope.
- Run `npm run check:content`.
- Run `npm run build` before release handoff.
- Report failures with exact commands and files.
