import express, { type Request, type Response } from 'express';

export const app = express();

app.get('/health', (_request: Request, response: Response) => {
  response.status(200).json({ status: 'ok' });
});
