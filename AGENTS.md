# Peptide America Agent Guide

This repo is the Next.js frontend for PeptideAmerica.com. Agents must preserve the Vial-first commerce architecture and avoid reintroducing mock storefront data or WooCommerce unless explicitly requested.

## Design Agent

Checks visual quality, mobile layout, colors, spacing, and animations.

Acceptance criteria:
- Dark navy, white, and red accent palette is consistent.
- Layouts work at mobile, tablet, and desktop widths.
- UI uses CSS/SVG/product-provider visuals unless approved assets are provided.
- Motion is tasteful and respects reduced-motion preferences.
- Cards, controls, and typography feel polished without marketing clutter.

## Frontend Agent

Checks components, routing, cart, product pages, state, and forms.

Acceptance criteria:
- Required routes render: `/`, `/shop`, `/shop/[slug]`, `/cart`, `/checkout`, `/coa`.
- Product cards, product pages, cart actions, and checkout validation work.
- Zustand cart state persists in localStorage.
- Client components are used only where interaction is required.
- Forms use real inputs, labels, buttons, and accessible states.
- Account access uses Clerk; do not reintroduce local password handling.

## Commerce Integration Agent

Checks Vial provider, REST routes, GraphQL route, and checkout handoff.

Acceptance criteria:
- Frontend, REST routes, and GraphQL route use `getCommerceProvider()`.
- `getCommerceProvider()` resolves to the Vial-backed provider.
- Checkout provider never collects card data in Next.js.
- Future secrets stay server-side only.
- Clerk secret keys stay server-side only.

## Compliance/Content Agent

Checks no prohibited claims, no prohibited use language, and no repetitive disclaimers.

Acceptance criteria:
- No medical, dosing, administration, human-use, animal-use, outcome, or performance claims.
- Product and COA values come from the live commerce provider or remain absent.
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
