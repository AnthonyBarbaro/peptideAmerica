# 01 Next.js Frontend MVP

The MVP includes `/`, `/shop`, `/shop/[slug]`, `/coa`, `/research-library`,
`/research-library/[slug]`, `/cart`, `/checkout`, `/search`, `/faq`, `/contact`,
and policy pages.

Implementation notes:
- Server Components by default.
- Client Components for cart, search, filters, dialogs, checkout, and accessibility preferences.
- The Vial provider powers UI and API routes.
- CSS gradients and inline SVG patterns provide the first visual system.
- Search covers products, COA records, and research library articles.
- Contact form validates locally only.
- Policy pages still require final legal/compliance review before live ordering.

Acceptance:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run check:content`
- `npm run build`
