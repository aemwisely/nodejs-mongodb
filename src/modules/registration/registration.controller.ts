import type { NextFunction, Request, Response } from 'express';

import { AbstractRegistrationService, type JoinEventType } from '../../core/registration';
import { BuildRegisterEventInput } from '../../core/registration/domain';
import { ForbiddenException } from '../../common';

export class RegistrationController {
  constructor(private readonly registrationService: AbstractRegistrationService) {}

  registerEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = Array.isArray(req.params.eventId) ? req.params.eventId[0] : req.params.eventId;
      const dto = BuildRegisterEventInput(eventId, req.body);

      const registration = await this.registrationService.registerEvent(dto);

      res.status(201).json({ result: registration });
    } catch (error) {
      next(error);
    }
  };

  handleJoiningEvent = async (req: Request, res: Response, next: NextFunction, type: JoinEventType): Promise<void> => {
    try {
      const eventId = Array.isArray(req.params.eventId) ? req.params.eventId[0] : req.params.eventId;

      const user = req?.user;

      if (!user) {
        throw new ForbiddenException({ error_code: 'INVALID_CREDENTIALS', error_message: 'Forbidden resource' });
      }

      await this.registrationService.handleJoinEvent(eventId, user, type);

      res.status(200).json({ result: { type } });
    } catch (error) {
      next(error);
    }
  };
}
