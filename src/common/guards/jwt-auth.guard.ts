import type { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';

import { UnauthorizedException } from '../exceptions';
import type { JwtPayload } from '../../core/auth';

export const jwtAuthGuard: RequestHandler = (request: Request, response: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (error: unknown, user?: JwtPayload) => {
    if (error) {
      next(error);
      return;
    }

    if (!user) {
      next(
        new UnauthorizedException({
          error_code: 'UNAUTHORIZED',
          error_message: 'Unauthorized',
        }),
      );
      return;
    }

    request.user = user;
    next();
  })(request, response, next);
};
