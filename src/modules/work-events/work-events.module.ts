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
   *   get:
   *     summary: List work events
   *     tags:
   *       - Work Events
   *     parameters:
   *       - in: query
   *         name: title
   *         schema:
   *           type: string
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: Work event list
   */
  router.get('/', controller.findAllAndCounted);

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
