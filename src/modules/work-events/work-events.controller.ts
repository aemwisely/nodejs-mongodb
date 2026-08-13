import type { NextFunction, Request, Response } from 'express';

import type { CreateWorkEventInput } from '../../core/work-events';
import { AbstractWorkEventService } from '../../core/work-events';

export class WorkEventsController {
  constructor(private readonly workEventService: AbstractWorkEventService) {}

  createWorkEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = this.toCreateWorkEventInput(req.body);

      const workEvent = await this.workEventService.createWorkEvent(dto);

      res.status(201).json(workEvent);
    } catch (error) {
      next(error);
    }
  };

  private toCreateWorkEventInput(body: unknown): CreateWorkEventInput {
    const payload = body as Partial<CreateWorkEventInput> & { is_active?: boolean };

    return {
      title: payload.title ?? '',
      description: payload.description,
      capacity: Number(payload.capacity),
      isActive: payload.isActive ?? payload.is_active,
    };
  }
}
