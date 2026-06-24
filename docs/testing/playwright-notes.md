# Playwright Notes

Playwright is configured with a Next.js `webServer` and a Chromium smoke suite in
`e2e/`.

Recommended e2e coverage when configured:
- Homepage loads.
- Shop search filters products.
- Product page opens from a product card.
- Add to cart works from shop and product page.
- Checkout blocks submit until attestation is checked.
- `/` opens the search dialog.
- Escape closes the search dialog.
- Accessibility panel changes text size and persists preferences.

Current Playwright coverage is intentionally light. Vitest remains the primary
coverage for provider data, search helpers, cart helpers, checkout behavior,
route inventory, and content compliance.
