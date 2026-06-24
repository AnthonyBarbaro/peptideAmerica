# Vial API Integration

The storefront uses Vial as the active commerce provider.

## Files

- `src/lib/vial/client.ts` handles authenticated JSON requests.
- `src/lib/vial/mapper.ts` maps Vial catalog payloads into the storefront `Product` model.
- `src/lib/vial/provider.ts` powers product, category, search, and COA reads.
- `src/lib/vial/orders.ts` builds guarded order payloads.
- `src/lib/commerce/provider.ts` returns the Vial provider.

## Environment

```bash
VIAL_API_BASE_URL=https://vialapi.com
VIAL_API_KEY=
VIAL_AUTH_HEADER=Authorization
VIAL_AUTH_SCHEME=Bearer
VIAL_INVENTORY_PATH=/api/v1/inventory
VIAL_PRODUCTS_PATH=/api/v1/products
VIAL_PRODUCT_PATH=
VIAL_ORDERS_PATH=/api/v1/orders
VIAL_ORDER_PATH=/api/v1/orders/:id
VIAL_ORDER_BY_EXTERNAL_ID_PATH=/api/v1/orders/by-external-id/:externalOrderId
VIAL_IDEMPOTENCY_HEADER=Idempotency-Key
VIAL_WEBHOOK_SECRET=
DATABASE_URL=
CHECKOUT_MODE=disabled
VIAL_ALLOW_UNPAID_ORDERS=false
```

The configured portal webhook URL should be:

```text
https://peptideamerica.com/api/vial/webhook
```

## Order Safety

The checkout provider does not collect card information. `CHECKOUT_MODE=vial_order` submits to Vial only when `VIAL_ALLOW_UNPAID_ORDERS=true` is deliberately set.

Keep that flag false unless an approved external process handles payment before fulfillment.

The normal live path is Authorize.Net first, then Vial:

1. Store checkout details in Postgres.
2. Create an Authorize.Net hosted payment session.
3. Verify the Authorize.Net webhook.
4. Mark the order paid.
5. Submit the stored order snapshot to Vial when `AUTO_SUBMIT_PAID_ORDERS_TO_VIAL=true`.
6. Store Vial webhook tracking/status updates in the same ledger.

Customer account history does not call Vial from the browser. Vial tracking/status webhooks update Postgres, then `/my-account` and `/track-order` read that ledger.
