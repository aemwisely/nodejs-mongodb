import type { NextFunction, Request, Response } from 'express';

import { AbstractAuthService, BuildLoginInput, type JwtPayload } from '../../core/auth';

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
      res.status(200).json({ result: req.user as JwtPayload });
    } catch (error) {
      next(error);
    }
  };
}
