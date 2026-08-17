import { Router } from 'express';

import { createUserModule } from '../../core/user';
import { UsersController } from './users.controller';

export const createUsersRouter = (): Router => {
  const router = Router();
  const { services } = createUserModule();
  const controller = new UsersController(services.userService);

  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     summary: List users
   *     tags:
   *       - Users
   *     parameters:
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
   *     responses:
   *       200:
   *         description: User list
   */
  router.get('/', controller.findAllAndCounted);

  return router;
};
