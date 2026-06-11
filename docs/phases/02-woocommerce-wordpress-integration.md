# 02 WooCommerce WordPress Integration

Later phases can replace the mock provider with WooCommerce-backed data.

Plan:
- Keep `getCommerceProvider()` as the switch point.
- Map Woo products into `Product`.
- Map product metadata and custom fields into technical specs and COA relationships.
- Keep consumer secrets server-side.
- Use REST for stable product/order operations and GraphQL for structured content where useful.
