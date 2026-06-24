# 02 Vial API Integration

The storefront uses Vial as the active commerce provider.

Plan:
- Keep `getCommerceProvider()` as the single commerce read switch point.
- Confirm Vial catalog endpoint paths and payloads.
- Map Vial products into `Product`.
- Map Vial lot/COA document fields into `CoaBatch`.
- Keep `VIAL_API_KEY` server-side only.
- Use REST and GraphQL routes as read surfaces backed by the same provider.
