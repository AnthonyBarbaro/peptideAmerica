# 05 Vial Fulfillment

Vial is the active fulfillment target unless the business approves a different fulfillment system.

Plan:
- Confirm the Vial order endpoint and required fields.
- Map line items by SKU, product ID, quantity, and unit price.
- Send an idempotency key with order submission.
- Confirm address validation requirements before live order acceptance.
- Connect tracking to `/track-order` after Vial tracking/status behavior is confirmed.
