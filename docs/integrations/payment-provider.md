# Payment Provider

Checkout does not collect card data in this Next.js app. The active payment scaffold is Authorize.Net Accept Hosted.

Live requirements:
- Select and underwrite an approved high-risk merchant account.
- Configure Authorize.Net Accept Hosted credentials.
- Keep provider credentials server-side only.
- Submit Vial orders only after payment approval unless a separate approved workflow handles payment.
- Keep `VIAL_ALLOW_UNPAID_ORDERS=false` by default.
- Add provider webhook validation and order-state reconciliation before fully automated fulfillment.

Webhook endpoint:

```text
/api/payment/authorize-net/webhook
```
