import { Router } from 'express';

import { createWorkEventsModule } from '../../core/work-events';
import { WorkEventsController } from './work-events.controller';

export const createWorkEventsRouter = (): Router => {
  const router = Router();
  const { services } = createWorkEventsModule();
  const controller = new WorkEventsController(services.workEventService);

  /**
   * @swagger
   * /api/v1/work-events:
   *   post:
   *     summary: Create work event
   *     tags:
   *       - Work Events
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateWorkEventBody'
   *     responses:
   *       201:
   *         description: Work event created
   */
  router.post('/', controller.createWorkEvent);

  return router;
};
