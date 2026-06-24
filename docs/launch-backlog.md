# Launch Backlog

This is the remaining work needed to move Peptide America to a Vial-backed production launch.

## Commerce And Product Data

- Confirm the real Vial catalog endpoint paths and response shape.
- Set `VIAL_API_BASE_URL`, `VIAL_API_KEY`, `VIAL_PRODUCTS_PATH`, and optional `VIAL_PRODUCT_PATH`.
- Confirm category taxonomy and product filtering rules from Vial data.
- Confirm which Vial fields map to price, SKU, stock state, size, specs, sequence, storage label, and COA documents.
- Add real product images or approved catalog assets.
- Decide whether `/peptides` should be added as a category landing route or redirected to `/shop`.

## COA And Batch Documentation

- Confirm the Vial fields for COA documents and lot/batch records.
- Confirm which purity/identity values can be displayed from approved documents.
- Keep fixed purity claims out of copy unless backed by real batch documentation.
- Add an operational review process for COA records before a product is promoted.

## Account And Login

- Configure Clerk production application keys.
- Enable approved OAuth providers in the Clerk dashboard.
- Confirm email verification and account recovery settings.
- Do not proxy or store customer passwords in Next.js.

## Newsletter And Forms

- Decide where catalog update signups are stored:
  - WordPress custom endpoint or form plugin
  - email platform such as Klaviyo, Mailchimp, or Brevo
  - custom backend endpoint
- Connect the footer newsletter form to the chosen storage system.
- Connect the contact form to a support mailbox, CRM, or WordPress form endpoint.
- Add spam protection for public forms.
- Add success/error states from the real backend response.
- Document opt-in, unsubscribe, and privacy handling before collecting emails.

## Checkout And Payments

- Complete high-risk merchant underwriting.
- Configure Authorize.Net Accept Hosted credentials.
- Keep card collection out of the Next.js frontend.
- Configure payment provider credentials server-side only.
- Validate cart, customer data, and required attestation before checkout handoff.
- Confirm whether Vial receives orders only after payment approval.
- Keep `VIAL_ALLOW_UNPAID_ORDERS=false` unless an approved external process handles payment.
- Add Postgres order ledger tables.
- Store verified Authorize.Net webhook/payment events.
- Add order-state reconciliation before Vial submission.
- Add checkout failure, cancel, and success pages if needed.

## Shipping And Fulfillment

- Confirm whether Vial is the fulfillment source of truth.
- Configure shipping methods, packaging rules, and tracking sync against the selected fulfillment source.
- Connect `/track-order` to the real order/fulfillment source.
- Finalize shipping regions and international shipping rules.
- Finalize shipping/delivery policy copy.

## Policy And Compliance Review

- Have legal/compliance review final policy pages:
  - Research Use Policy
  - Privacy Policy
  - Return and Refund Policy
  - Shipping and Delivery Policy
  - Terms and Conditions
- Review all storefront copy for research-only positioning.
- Avoid medical, dosing, administration, human-use, animal-use, bodybuilding, weight-loss, or disease claims.
- Decide whether any FDA or regulatory notice is required, and write it in a way that does not violate the site content rules.
- Run `npm run check:content` after every content update.

## SEO And Content

- Finalize homepage and product metadata.
- Add approved product schema only for catalog/product information.
- Keep medical schema out of the site.
- Add final research library articles from approved neutral documentation topics.
- Add affiliate/partner terms if the partner program launches.
- Verify sitemap includes all production routes.
- Confirm robots rules before launch.

## Accessibility And UX QA

- Run keyboard QA for nav, mobile menu, search, cart, checkout, account, newsletter, and contact forms.
- Confirm skip-to-content works.
- Confirm visible focus states.
- Confirm Escape closes dialogs.
- Confirm accessibility preference persistence.
- Confirm reduced-motion mode disables or minimizes animation.
- Test responsive layouts on mobile, tablet, and desktop.

## Testing And Deployment

- Add Playwright configuration with a `webServer`.
- Add e2e tests for homepage, shop search, product detail, cart, checkout attestation, search dialog, account page, newsletter form, and accessibility panel.
- Run before deployment:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test`
  - `npm run check:content`
  - `npm run build`
- Configure Vercel environment variables.
- Verify production domain and redirects.
- Run a production smoke test after deploy.

## Current Known Frontend-Only Placeholders

- Newsletter signup does not store emails yet.
- Contact form validates locally only.
- Account page requires Clerk production keys and enabled sign-in methods.
- Checkout is blocked unless Vial order env vars and order approval are configured.
- Track order page needs a real order/fulfillment lookup.
- Shipping and fulfillment are not connected.
- Partner program needs approved terms before launch.
