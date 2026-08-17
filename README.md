# Express TypeScript Health API

Minimal Express.js application written in TypeScript.

## Scripts

- `npm run dev` starts the development server with watch mode.
- `npm run build` compiles TypeScript to `dist/`.
- `npm start` starts the compiled server.

The health endpoint is available at `GET /health` and returns:

```json
{"status":"ok"}
```
