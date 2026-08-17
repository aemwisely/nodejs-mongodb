import { Router } from 'express';

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
   *       201:
   *         description: User registered to event
   */
  router.post('/:eventId', controller.registerEvent);

  return router;
};
