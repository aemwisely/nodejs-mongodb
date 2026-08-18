import type { RequestHandler } from 'express';

import { ForbiddenException, UnauthorizedException } from '../exceptions';
import type { UserRole } from '../../core/user/domain';

export const rolesGuard =
  (...roles: UserRole[]): RequestHandler =>
  (request, _response, next): void => {
    if (!request.user) {
      next(
        new UnauthorizedException({
          error_code: 'UNAUTHORIZED',
          error_message: 'Unauthorized',
        }),
      );
      return;
    }

    if (!roles.includes(request.user.role)) {
      next(
        new ForbiddenException({
          error_code: 'FORBIDDEN_RESOURCE',
          error_message: "Can't access this resource",
        }),
      );
      return;
    }

    next();
  };
