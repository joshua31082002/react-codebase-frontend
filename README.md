# Health App

Minimal Spring Boot application exposing `GET /api/health` with PostgreSQL connectivity verification.

Run the application and PostgreSQL database with Compose:

```bash
docker compose up --build
```

The application listens on port `8080` inside the container and is published on host port `4173`. The health endpoint runs `SELECT 1` against PostgreSQL and returns `503` when the database is unavailable. Configure the datasource with `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.
