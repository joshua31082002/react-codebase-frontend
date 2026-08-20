# Spring Boot Health Service

A minimal Spring Boot service exposing a standard health endpoint through Spring Boot Actuator.

## Endpoint

`GET /actuator/health`

A healthy service returns HTTP `200` with a response such as:

```json
{"status":"UP"}
```

The port defaults to `4173` and can be overridden with the `PORT` environment variable.

## Run locally

```bash
mvn spring-boot:run
```

## Test and package

```bash
mvn test
mvn package
```

## Run with Docker Compose

```bash
docker compose up --build
```

The service is available at `http://localhost:4173/actuator/health`.
