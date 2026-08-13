import { Router } from 'express';

import { createWorkEventsModule } from '../../core/work-events';
import { WorkEventsController } from './work-events.controller';

export const createWorkEventsRouter = (): Router => {
  const router = Router();
  const { services } = createWorkEventsModule();
  const controller = new WorkEventsController(services.workEventService);

  router.post('/', controller.createWorkEvent);

  return router;
};
