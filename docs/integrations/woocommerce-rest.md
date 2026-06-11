# WooCommerce REST Integration

The REST adapter placeholder lives at `src/lib/woocommerce/rest-client.ts`.

Future mapping:
- Woo product ID -> `Product.id`
- slug -> `Product.slug`
- name -> `Product.name`
- SKU -> `Product.sku`
- price -> `Product.priceCents`
- stock status -> `Product.stockStatus`
- metadata -> technical specs, storage label, purity label, sequence, and COA links

Secrets:
- `WOOCOMMERCE_CONSUMER_KEY`
- `WOOCOMMERCE_CONSUMER_SECRET`

These must only be read on the server.
