# Peptide America VialAPI Integration Guide

Last updated: 2026-06-23

## Overview

Peptide America connects to VialAPI to sync inventory, submit fulfillment orders, check order status, receive tracking, and receive webhook updates.

VialAPI is the only API Peptide America needs to integrate with.

## Base URL

```text
https://vialapi.com
```

## Authentication

Every request must include the Peptide America VialAPI key:

```http
Authorization: Bearer <PEPTIDE_AMERICA_VIALAPI_KEY>
```

For requests with a JSON body, also send:

```http
Content-Type: application/json
```

Keep the API key server-side only. Do not place it in browser JavaScript, public repositories, screenshots, client-side logs, customer-facing settings, or mobile app bundles.

## Required Setup Values

Peptide America needs these values before going live:

| Value | Description |
| --- | --- |
| API key | Server-side bearer token for VialAPI requests. |
| Webhook URL | HTTPS endpoint on Peptide America's server that receives VialAPI updates. |
| Webhook signing secret | Secret used by Peptide America to verify webhook signatures. |
| Product SKU list | Peptide America storefront SKUs or item identifiers. |
| Product aliases | Optional shorthand, misspellings, and staff-entered names that should map to approved products. |

## Endpoint Summary

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/inventory` | Pull current product availability. |
| `GET` | `/api/v1/products` | Pull order-ready products configured for Peptide America. |
| `POST` | `/api/v1/orders` | Submit a fulfillment order. |
| `GET` | `/api/v1/orders/{id}` | Look up an order by VialAPI order ID. |
| `GET` | `/api/v1/orders/by-external-id/{externalOrderId}` | Look up an order by Peptide America's order ID. |

## Inventory Feed

```http
GET /api/v1/inventory
```

Use this endpoint to pull current product availability.

### Request

```bash
curl https://vialapi.com/api/v1/inventory \
  -H "Authorization: Bearer <PEPTIDE_AMERICA_VIALAPI_KEY>"
```

### Response

```json
{
  "inventory": [
    {
      "sku": "PA-ITEM-10MG",
      "name": "Catalog Item 10mg",
      "status": "active",
      "quantity": 24,
      "lowStockThreshold": 5,
      "lowStock": false,
      "inventorySyncedAt": "2026-06-23T18:15:00.000Z"
    }
  ]
}
```

### Inventory Fields

| Field | Type | Description |
| --- | --- | --- |
| `inventory[].sku` | string | Peptide America-facing SKU. |
| `inventory[].name` | string | Display name for the item. |
| `inventory[].status` | string | Item status. |
| `inventory[].quantity` | number or null | Current available quantity when available. |
| `inventory[].lowStockThreshold` | number or null | Threshold used to flag low stock when available. |
| `inventory[].lowStock` | boolean | Whether the item is currently low stock. |
| `inventory[].inventorySyncedAt` | string or null | Timestamp for the latest inventory sync, in ISO 8601 UTC format. |

### Recommended Inventory Sync

Poll every 5 to 15 minutes for storefront availability and operations.

Recommended behavior:

- Cache the latest successful response.
- Store `sku`, `name`, `quantity`, `lowStock`, and `inventorySyncedAt`.
- Use `inventorySyncedAt` to show freshness in Peptide America's admin tools.
- Treat inventory as availability guidance.
- Use the create-order response as the final order result.

## Order-Ready Products

```http
GET /api/v1/products
```

Use this endpoint to pull the products that are configured for Peptide America order submission.

### Request

```bash
curl https://vialapi.com/api/v1/products \
  -H "Authorization: Bearer <PEPTIDE_AMERICA_VIALAPI_KEY>"
```

### Response

```json
{
  "products": [
    {
      "sku": "PA-ITEM-10MG",
      "name": "Catalog Item 10mg",
      "status": "active"
    }
  ]
}
```

Use `products[].sku` when creating live orders.

## Product Names and Aliases

Peptide America should send stable SKUs whenever possible.

VialAPI can also support approved aliases for storefront titles, shorthand names, and common staff-entered variations. Peptide America should send the expected storefront product list and aliases before go-live so VialAPI can configure them.

If a submitted SKU or alias is not recognized, the order returns a review response instead of being guessed.

## Create Order

```http
POST /api/v1/orders
```

Use this endpoint to submit a fulfillment order.

### Required Fields

| Field | Type | Description |
| --- | --- | --- |
| `externalOrderId` | string | Stable Peptide America order ID. |
| `shipTo.recipientName` | string | Recipient full name. |
| `shipTo.address1` | string | Shipping address line 1. |
| `shipTo.city` | string | Shipping city. |
| `shipTo.state` | string | Shipping state or province. |
| `shipTo.postalCode` | string | Shipping postal code. |
| `lineItems[]` | array | At least one item is required. |
| `lineItems[].sku` | string | SKU from VialAPI product setup. |
| `lineItems[].quantity` | number | Positive whole number. |

### Optional Fields

| Field | Type | Description |
| --- | --- | --- |
| `customer.firstName` | string | Customer first name. |
| `customer.lastName` | string | Customer last name. |
| `customer.company` | string | Customer company. |
| `customer.email` | string | Customer email. |
| `customer.phone` | string | Customer phone. |
| `shipTo.recipientCompany` | string | Recipient company. |
| `shipTo.address2` | string | Shipping address line 2. |
| `shipTo.country` | string | Country code. Defaults to `US`. |
| `shipTo.residential` | boolean | Defaults to `true`. |
| `metadata` | object | Extra Peptide America order context. |

### Request

```bash
curl -X POST https://vialapi.com/api/v1/orders \
  -H "Authorization: Bearer <PEPTIDE_AMERICA_VIALAPI_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "externalOrderId": "PA-1001",
    "customer": {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phone": "555-555-0100"
    },
    "shipTo": {
      "recipientName": "Jane Doe",
      "address1": "1 Main St",
      "address2": "Suite 100",
      "city": "Las Vegas",
      "state": "NV",
      "postalCode": "89101",
      "country": "US",
      "residential": true
    },
    "lineItems": [
      {
        "sku": "PA-ITEM-10MG",
        "quantity": 2
      }
    ],
    "metadata": {
      "platform": "shopify",
      "checkoutId": "checkout_1001"
    }
  }'
```

### Accepted Response

```json
{
  "id": "cmq_order_123",
  "externalOrderId": "PA-1001",
  "tenant": "peptide-america",
  "status": "awaiting_fulfillment",
  "fulfillment": {
    "status": "pending",
    "orderId": "fulfillment_order_123",
    "orderNumber": "F1001"
  },
  "tracking": null,
  "review": null
}
```

### Review Response

```json
{
  "id": "cmq_order_124",
  "externalOrderId": "PA-1002",
  "tenant": "peptide-america",
  "status": "needs_review",
  "fulfillment": {
    "status": "pending_approval",
    "orderId": "fulfillment_order_124",
    "orderNumber": "F1002"
  },
  "tracking": null,
  "review": {
    "unmappedSkus": ["PA-UNKNOWN-ITEM"],
    "insufficientSkus": []
  }
}
```

### Duplicate Protection

Peptide America should send one stable `externalOrderId` per order.

If the same `externalOrderId` is submitted again, VialAPI returns the existing order instead of creating a duplicate.

Store both:

- Peptide America's `externalOrderId`
- VialAPI's returned `id`

## Get Order by VialAPI ID

```http
GET /api/v1/orders/{id}
```

### Request

```bash
curl https://vialapi.com/api/v1/orders/cmq_order_123 \
  -H "Authorization: Bearer <PEPTIDE_AMERICA_VIALAPI_KEY>"
```

### Response

The response uses the same order shape returned by `POST /api/v1/orders`.

## Get Order by Peptide America Order ID

```http
GET /api/v1/orders/by-external-id/{externalOrderId}
```

Use this endpoint when Peptide America knows its own order ID but not the VialAPI order ID.

### Request

```bash
curl https://vialapi.com/api/v1/orders/by-external-id/PA-1001 \
  -H "Authorization: Bearer <PEPTIDE_AMERICA_VIALAPI_KEY>"
```

If the order ID contains spaces, slashes, `#`, or other special characters, URL-encode the value.

## Order Statuses

| Status | Meaning |
| --- | --- |
| `received` | VialAPI received the order. |
| `validated` | Required fields and product mapping passed validation. |
| `processing` | VialAPI is processing the order. |
| `awaiting_fulfillment` | Order was accepted and is waiting for fulfillment progress. |
| `needs_review` | Order exists, but a review issue must be resolved. |
| `awaiting_tracking` | Order exists and tracking is not available yet. |
| `shipped` | Tracking has been received. |
| `delivered` | Delivery has been confirmed. |
| `cancelled` | Order was cancelled. |
| `failed` | Order could not be processed. |

Recommended storefront handling:

- Show `received`, `validated`, `processing`, `awaiting_fulfillment`, and `awaiting_tracking` as in progress.
- Show `needs_review` as an operations hold.
- Show `shipped` with tracking.
- Show `delivered` as complete.
- Show `cancelled` or `failed` as needing support review.

## Tracking

Tracking appears on the order response once available.

```json
{
  "tracking": {
    "trackingNumber": "1Z9999999999999999",
    "service": "Ground",
    "carrier": "UPS",
    "trackingUrl": "https://example-carrier.com/track/1Z9999999999999999",
    "shippedAt": "2026-06-23T18:30:00.000Z"
  }
}
```

Peptide America can either poll order lookup endpoints or receive webhook updates.

## Webhooks from VialAPI to Peptide America

Peptide America can provide an HTTPS webhook URL to receive fulfillment and tracking updates.

Example webhook URL:

```text
https://peptideamerica.com/api/vialapi/webhooks
```

Current portal webhook URL:

```text
https://peptideamerica.com/api/vial/webhook
```

VialAPI sends webhook requests as `POST` requests with a JSON body.

Peptide America should return any `2xx` status code to acknowledge receipt.

Webhook delivery is at least once. Peptide America should dedupe using `X-VialAPI-Delivery`.

### Webhook Events

| Event | When It Is Sent |
| --- | --- |
| `order.approved` | Order is approved for fulfillment. |
| `order.status_changed` | Order status changes. |
| `order.label_created` | A shipping label has been created and tracking is available. |
| `order.shipped` | Shipment has been marked shipped. |

### Webhook Headers

```http
Content-Type: application/json
X-VialAPI-Event: order.label_created
X-VialAPI-Delivery: <unique_delivery_id>
X-VialAPI-Timestamp: <unix_timestamp>
X-VialAPI-Signature: sha256=<hex_signature>
```

### Webhook Payload

```json
{
  "event": "order.label_created",
  "vialapiOrderId": "cmq_order_123",
  "externalOrderId": "PA-1001",
  "status": "awaiting_tracking",
  "tracking": {
    "trackingNumber": "1Z9999999999999999",
    "service": "Ground",
    "carrier": "UPS",
    "trackingUrl": "https://example-carrier.com/track/1Z9999999999999999",
    "shippedAt": null
  }
}
```

For events without tracking, `tracking` can be `null`.

### Webhook Signature Verification

The signature is calculated with HMAC SHA-256 over:

```text
<timestamp>.<exact_request_body>
```

Use the webhook signing secret provided for Peptide America.

Node.js example:

```ts
import crypto from "node:crypto";

export function verifyVialapiWebhook({
  bodyText,
  timestamp,
  signature,
  secret
}: {
  bodyText: string;
  timestamp: string;
  signature: string;
  secret: string;
}) {
  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${bodyText}`, "utf8")
      .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
```

Recommended webhook handler behavior:

- Read the exact request body text before parsing JSON.
- Verify `X-VialAPI-Signature`.
- Reject signatures older than 5 minutes.
- Dedupe by `X-VialAPI-Delivery`.
- Store `event`, `externalOrderId`, `status`, and `tracking`.
- Return `200`, `201`, or `204` after successfully receiving the event.

## Errors

| HTTP Status | Code | Meaning |
| --- | --- | --- |
| `400` | `invalid_request` | Request body is not valid JSON or failed validation. |
| `401` | `unauthorized` | Missing or invalid API key. |
| `404` | `not_found` | Order was not found for this API key. |
| `422` | `needs_review` | Submitted SKU is not configured. |
| `500` | `server_error` | Unexpected VialAPI error. |

### Validation Error Example

```json
{
  "error": "invalid_request",
  "message": "Order payload failed validation",
  "issues": [
    {
      "path": ["shipTo", "address1"],
      "message": "Too small: expected string to have >=1 characters"
    }
  ]
}
```

### Review Error Example

```json
{
  "error": "needs_review",
  "message": "Unmapped SKU: PA-UNKNOWN-ITEM",
  "unmappedSkus": ["PA-UNKNOWN-ITEM"]
}
```

## Go-Live Checklist

- Store the Peptide America VialAPI key in a server-side environment variable.
- Confirm the Peptide America webhook URL is HTTPS.
- Store the webhook signing secret in a server-side environment variable.
- Verify webhook signatures before processing events.
- Pull `GET /api/v1/inventory`.
- Pull `GET /api/v1/products`.
- Submit one test order with a valid SKU.
- Submit one test order with an invalid SKU and confirm review handling.
- Confirm order lookup by VialAPI ID.
- Confirm order lookup by Peptide America order ID.
- Confirm `order.label_created` webhook handling.
- Confirm `order.shipped` webhook handling.
- Confirm tracking links are stored and clickable in Peptide America's system.
