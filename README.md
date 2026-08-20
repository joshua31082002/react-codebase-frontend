# Health API

A minimal Rails API exposing a health check endpoint.

## Run with Docker

```sh
docker compose up --build
```

The server listens on `http://localhost:4173`.

## Health endpoint

```sh
curl http://localhost:4173/health
```

Example response:

```json
{
  "status": "ok",
  "service": "health-api",
  "timestamp": "2026-01-01T00:00:00Z"
}
```

The timestamp is generated at request time.
