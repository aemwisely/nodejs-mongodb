import type { NextFunction, Request, Response } from 'express';

import { AbstractRegistrationService } from '../../core/registration';
import { BuildRegisterEventInput } from '../../core/registration/domain';

export class RegistrationController {
  constructor(private readonly registrationService: AbstractRegistrationService) {}

  registerEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = BuildRegisterEventInput(req.body);
      const registration = await this.registrationService.registerEvent(dto);

      res.status(201).json({ result: registration });
    } catch (error) {
      next(error);
    }
  };
}
