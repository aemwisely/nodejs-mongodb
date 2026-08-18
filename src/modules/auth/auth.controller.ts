import type { NextFunction, Request, Response } from 'express';

import { AbstractAuthService, BuildLoginInput, type JwtPayload } from '../../core/auth';
import { UnauthorizedException } from '../../common';

export class AuthController {
  constructor(private readonly authService: AbstractAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = BuildLoginInput(req.body);
      const token = await this.authService.login(dto);

      res.status(200).json({ result: token });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req?.user;

      if (!user) {
        throw new UnauthorizedException({
          error_code: 'INVALID_CREDENTIALS',
          error_message: 'Invalid phone number',
        });
      }

      const findUserEntity = await this.authService.getMe(user);

      res.status(200).json({ result: findUserEntity });
    } catch (error) {
      next(error);
    }
  };
}
