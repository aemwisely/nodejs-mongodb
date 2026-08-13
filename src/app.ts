import express, { type Request, type Response } from "express";

import { transformInterceptor } from "./common";

export const app = express();

app.use(express.json());
app.use(transformInterceptor);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});
