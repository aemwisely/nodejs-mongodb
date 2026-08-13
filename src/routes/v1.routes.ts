import { Router, type Request, type Response } from 'express';

import { createWorkEventsRouter } from '../modules';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/work-events', createWorkEventsRouter());

export const v1Routes = router;
