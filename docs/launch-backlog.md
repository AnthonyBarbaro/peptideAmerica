# Launch Backlog

This is the remaining work needed to move Peptide America from the Phase 1 mock storefront to a production launch.

## Commerce And Product Data

- Connect the commerce provider to WordPress/WooCommerce.
- Map WooCommerce products into the existing `Product` model.
- Replace placeholder product names, prices, SKUs, sizes, descriptions, specs, sequences, stock states, and tags with approved supplier/catalog data.
- Confirm category taxonomy and product filtering rules.
- Add real product images or approved generated/photographed catalog assets.
- Decide whether `/peptides` should be added as a category landing route or redirected to `/shop`.

## COA And Batch Documentation

- Replace all sample COA records with real supplier batch records.
- Store COA fields in WordPress/WooCommerce or a dedicated document source.
- Upload production COA documents and update `documentUrl` values.
- Add admin review workflow for COA status before publishing.
- Confirm which purity/identity values can be displayed from approved documents.
- Keep fixed purity claims out of copy unless backed by real batch documentation.

## Account And Login

- Choose account handoff mode:
  - `WORDPRESS_ACCOUNT_URL`
  - or `WOOCOMMERCE_URL/my-account`
- Confirm WordPress/WooCommerce account registration settings.
- Confirm lost-password URL.
- Decide whether account login stays as redirect handoff or later becomes a headless auth flow.
- Do not proxy or store customer passwords in Next.js unless a formal auth architecture is approved.

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

- Select a hosted checkout or WooCommerce redirect flow.
- Keep card collection out of the Next.js frontend.
- Configure payment provider credentials server-side only.
- Validate cart, customer data, and required attestation before checkout handoff.
- Add webhook handling and order-state reconciliation.
- Add checkout failure, cancel, and success pages if needed.

## Shipping And Fulfillment

- Decide whether ShipStation connects through WooCommerce plugin mode or direct API.
- Configure shipping methods, packaging rules, and tracking sync.
- Connect `/track-order` to the real order/fulfillment source.
- Finalize shipping regions and international shipping rules.
- Replace placeholder shipping/delivery policy copy.

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
- Account page is not connected to live WordPress/WooCommerce yet.
- Checkout validates locally only and does not process payment.
- Track order page is a placeholder.
- Shipping and fulfillment are not connected.
- COA records and product data are sample placeholders.
- Partner program page is a placeholder.
