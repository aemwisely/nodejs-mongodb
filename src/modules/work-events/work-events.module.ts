import { Router } from 'express';

import { createRegistrationModule } from '../../core/registration';
import { createWorkEventsModule } from '../../core/work-events';
import { WorkEventsController } from './work-events.controller';

export const createWorkEventsRouter = (): Router => {
  const router = Router();
  const workEventsModule = createWorkEventsModule();
  const registrationModule = createRegistrationModule();
  const controller = new WorkEventsController(
    workEventsModule.services.workEventService,
    registrationModule.services.registrationService,
  );

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
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           default: 10
   *       - in: query
   *         name: pagination
   *         schema:
   *           type: boolean
   *           default: true
   *     responses:
   *       200:
   *         description: Work event list
   */
  router.get('/', controller.findAllAndCounted);

  /**
   * @swagger
   * /api/v1/work-events/{id}/get-user-event:
   *   get:
   *     summary: Get users joined work event
   *     tags:
   *       - Work Events
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           default: 10
   *       - in: query
   *         name: pagination
   *         schema:
   *           type: boolean
   *           default: true
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [createdAt, firstName, lastName, phoneNumber]
   *       - in: query
   *         name: sortDirection
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *     responses:
   *       200:
   *         description: Joined users list
   *       404:
   *         description: Work event not found
   */
  router.get('/:id/get-user-event', controller.findListUserJoinEvent);

  /**
   * @swagger
   * /api/v1/work-events/{id}:
   *   get:
   *     summary: Get work event by id
   *     tags:
   *       - Work Events
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Work event detail
   *       404:
   *         description: Work event not found
   */
  router.get('/:id', controller.findById);

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
