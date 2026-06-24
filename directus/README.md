# Peptide America Directus Service

Deploy this folder as a separate Railway service from the repository root.

The Docker image is pinned to `directus/directus:12.0.2`. The container runs
Directus bootstrap through `node cli.js bootstrap`, applies the commerce/admin
migration, then starts Directus with `node cli.js start`.
It listens on Railway's injected `PORT` value and falls back to `8055` outside
Railway.

Required Railway variables:

```bash
RAILWAY_DOCKERFILE_PATH=directus/Dockerfile
KEY=<random 32+ character secret>
SECRET=<random 32+ character secret>
PUBLIC_URL=https://admin.peptideamerica.com
DB_CLIENT=pg
DB_CONNECTION_STRING=${{Postgres.DATABASE_URL}}
ADMIN_EMAIL=anthony@barbaro.tech
ADMIN_PASSWORD=<temporary strong password>
TELEMETRY=false
```

If using a public Postgres URL instead of Railway private networking, set the
SSL options required by the provider, commonly:

```bash
DB_SSL__REJECT_UNAUTHORIZED=false
```

See `../docs/integrations/directus-admin.md` for the full handoff.
