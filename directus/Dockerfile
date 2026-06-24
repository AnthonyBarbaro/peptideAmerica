FROM directus/directus:12.0.2

COPY directus/migrations ./migrations

ENV HOST=0.0.0.0
ENV PORT=8055
ENV DB_CLIENT=pg
ENV MIGRATIONS_PATH=./migrations

CMD ["sh", "-c", "directus bootstrap && directus database migrate:latest && directus start"]
