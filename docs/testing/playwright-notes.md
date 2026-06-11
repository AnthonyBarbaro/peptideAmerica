# Playwright Notes

Playwright is installed, but Phase 1 does not yet include a committed Playwright
configuration with `webServer`, browser projects, and test artifacts.

Recommended e2e coverage when configured:
- Homepage loads.
- Shop search filters products.
- Product page opens from a product card.
- Add to cart works from shop and product page.
- Checkout blocks submit until attestation is checked.
- `/` opens the search dialog.
- Escape closes the search dialog.
- Accessibility panel changes text size and persists preferences.

Current automated coverage is focused in Vitest for provider data, search helpers,
cart helpers, checkout behavior, route inventory, and content compliance.
