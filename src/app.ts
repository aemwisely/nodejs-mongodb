import express, { type Request, type Response } from 'express';
import { corsOptions, transformInterceptor } from './common';
import cors from 'cors';

export const app = express();

app.use(express.json());
app.use(transformInterceptor);
app.use(cors(corsOptions));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});
