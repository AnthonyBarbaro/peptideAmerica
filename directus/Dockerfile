FROM directus/directus:12.0.2

COPY directus/migrations ./migrations

ENV HOST=0.0.0.0
ENV DB_CLIENT=pg
ENV MIGRATIONS_PATH=./migrations

CMD ["sh", "-c", "export PORT=${PORT:-8055} && node cli.js bootstrap && node cli.js database migrate:latest && node cli.js start"]
