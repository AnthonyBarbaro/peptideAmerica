# Catalog Pricing and Display Overrides

Vial is still the source of truth for available SKUs and order submission. If Vial does not send storefront pricing or display fields, add approved overrides by SKU in:

```text
src/data/catalog-overrides.ts
```

Example:

```ts
"AOD9604-10MG": {
  priceCents: 9900,
  category: "Reference Materials",
  sizeLabel: "10mg",
  shortDescription: "Approved storefront summary.",
  tags: ["featured"],
},
```

Use cents for pricing:

- `$99.00` is `9900`
- `$129.95` is `12995`
- `$0.00` or a missing price shows `Price pending` and disables cart actions

Supported fields:

- `priceCents`
- `category`
- `sizeLabel`
- `shortDescription`
- `researchOverview`
- `purityLabel`
- `storageLabel`
- `molecularWeight`
- `sequence`
- `tags`
- `images`
- `technicalSpecs`

Do not add claims, use instructions, outcome language, or unapproved COA values. Keep COA records from Vial or approved supplier documents.
