# Peptide America Directus Service

Deploy this folder as a separate Railway service.

The Docker image is pinned to `directus/directus:12.0.2`. The container runs
Directus bootstrap, applies the commerce/admin migration, then starts Directus.

Required Railway variables:

```bash
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
