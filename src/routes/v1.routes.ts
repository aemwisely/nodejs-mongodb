import { Router, type Request, type Response } from 'express';

import { createAuthRouter, createRegistrationRouter, createUsersRouter, createWorkEventsRouter } from '../modules';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', createAuthRouter());
router.use('/work-events', createWorkEventsRouter());
router.use('/users', createUsersRouter());
router.use('/registrations', createRegistrationRouter());

export const v1Routes = router;
