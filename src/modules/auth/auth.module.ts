import { Router } from 'express';

import { jwtAuthGuard } from '../../common';
import { createAuthModule } from '../../core/auth';
import { AuthController } from './auth.controller';

export const createAuthRouter = (): Router => {
  const router = Router();
  const { services } = createAuthModule();
  const controller = new AuthController(services.authService);

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: Login with phone number
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - phone_number
   *             properties:
   *               phone_number:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login success
   *       401:
   *         description: Invalid credentials
   *       403:
   *         description: User is inactive
   */
  router.post('/login', controller.login);

  /**
   * @swagger
   * /api/v1/auth/me:
   *   get:
   *     summary: Get current auth payload
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current auth payload
   *       401:
   *         description: Unauthorized
   */
  router.get('/me', jwtAuthGuard, controller.me);

  return router;
};
