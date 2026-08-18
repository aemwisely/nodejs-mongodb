import { Router } from 'express';

import { jwtAuthGuard } from '../../common';
import { createRegistrationModule } from '../../core/registration';
import { RegistrationController } from './registration.controller';

export const createRegistrationRouter = (): Router => {
  const router = Router();
  const { services } = createRegistrationModule();
  const controller = new RegistrationController(services.registrationService);

  /**
   * @swagger
   * /api/v1/registrations/{eventId}:
   *   post:
   *     summary: Register user to work event
   *     tags:
   *       - Registrations
   *     parameters:
   *       - in: path
   *         name: eventId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - first_name
   *               - last_name
   *               - phone_number
   *             properties:
   *               first_name:
   *                 type: string
   *               last_name:
   *                 type: string
   *               phone_number:
   *                 type: string
   *     responses:
   *       200:
   *         description: User checked in to event
   */
  router.post('/:eventId', controller.registerEvent);

  /**
   * @swagger
   * /api/v1/registrations/{eventId}/check-in:
   *   post:
   *     summary: Register user to work event
   *     tags:
   *       - Registrations
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: eventId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User checked out from event
   */
  router.post('/:eventId/check-in', jwtAuthGuard, (req, res, next) =>
    controller.handleJoiningEvent(req, res, next, 'CHECK-IN'),
  );

  /**
   * @swagger
   * /api/v1/registrations/{eventId}/check-out:
   *   post:
   *     summary: Register user to work event
   *     tags:
   *       - Registrations
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: eventId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       201:
   *         description: User registered to event
   */
  router.post('/:eventId/check-out', jwtAuthGuard, (req, res, next) =>
    controller.handleJoiningEvent(req, res, next, 'CHECK-OUT'),
  );

  return router;
};
