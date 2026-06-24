# 04 Payments Gateway

Next.js checkout does not collect card data.

Plan:
- Use an approved high-risk merchant account.
- Use Authorize.Net Accept Hosted for the payment form.
- Do not collect card details in Next.js.
- Keep payment credentials server-side.
- Validate cart, customer details, shipping details, and attestation before order handoff.
- Submit Vial orders only after payment approval unless an approved external process handles payment.
- Keep `VIAL_ALLOW_UNPAID_ORDERS=false` by default.
- Store verified Authorize.Net payment events in the order ledger before Vial submission.
- Use Railway Postgres or another Postgres database for `DATABASE_URL`.
- Keep `AUTO_SUBMIT_PAID_ORDERS_TO_VIAL=false` until sandbox payment webhooks and a test Vial order have been validated.
