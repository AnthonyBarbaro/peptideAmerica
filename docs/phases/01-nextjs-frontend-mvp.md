# 01 Next.js Frontend MVP

The MVP includes `/`, `/shop`, `/shop/[slug]`, `/coa`, `/research-library`,
`/research-library/[slug]`, `/cart`, `/checkout`, `/search`, `/faq`, `/contact`,
and placeholder policy pages.

Implementation notes:
- Server Components by default.
- Client Components for cart, search, filters, dialogs, checkout, and accessibility preferences.
- Mock provider data powers both UI and API routes.
- CSS gradients and inline SVG patterns provide the first visual system.
- Search covers products, sample COA records, and research library articles.
- Contact form validates locally only.
- Policy pages are placeholders pending reviewed final copy.

Acceptance:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run check:content`
- `npm run build`
