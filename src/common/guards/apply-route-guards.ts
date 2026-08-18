import type { RequestHandler } from 'express';

import { getRouteRoles } from '../decorators';
import { jwtAuthGuard } from './jwt-auth.guard';
import { rolesGuard } from './roles.guard';

export const applyRouteGuards = <TController extends object>(
  controller: TController,
  actionName: keyof TController & string,
): RequestHandler[] => {
  const action = controller[actionName];

  if (typeof action !== 'function') {
    throw new Error(`Controller action "${actionName}" is not a function`);
  }

  const roles = getRouteRoles(Object.getPrototypeOf(controller), actionName);
  const handler = action.bind(controller) as RequestHandler;

  if (roles.length === 0) {
    return [handler];
  }

  return [jwtAuthGuard, rolesGuard(...roles), handler];
};
