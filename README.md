# Express TypeScript Health API

A minimal Express.js application written in TypeScript.

## Run locally

```bash
npm install
npm run dev
```

The server listens on port `3000` by default. Set `PORT` to use a different port.

## Health endpoint

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "ok"
}
```

## Production build

```bash
npm run build
npm start
```
