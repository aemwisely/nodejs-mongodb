import type { NextFunction, Request, Response } from 'express';

import type { CreateWorkEventInput } from '../../core/work-events';
import { AbstractWorkEventService } from '../../core/work-events';
import { BuildWorkEventInput } from '../../core/work-events/domain';

export class WorkEventsController {
  constructor(private readonly workEventService: AbstractWorkEventService) {}

  createWorkEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = BuildWorkEventInput(req.body);

      const workEvent = await this.workEventService.createWorkEvent(dto);

      res.status(201).json(workEvent);
    } catch (error) {
      next(error);
    }
  };

  findAllAndCounted = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.workEventService.findAllAndCounted();

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
