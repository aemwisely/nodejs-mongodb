import { Router, type Request, type Response } from 'express';

import { createUsersRouter, createWorkEventsRouter } from '../modules';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/work-events', createWorkEventsRouter());
router.use('/users', createUsersRouter());

export const v1Routes = router;
