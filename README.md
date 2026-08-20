# Next.js Health App

Minimal Next.js application exposing a health endpoint.

## Run locally

```bash
npm install
npm run dev
```

The application listens on port `4173` by default. Set `PORT` to use a different port.

## Health endpoint

```bash
curl http://localhost:4173/health
```

Response:

```json
{"status":"ok"}
```

## Build and run

```bash
npm run build
npm start
```
