import type { NextFunction, Request, Response } from 'express';

import { CommonFilter } from '../../common';
import { AbstractWorkEventService } from '../../core/work-events';
import { BuildListWorkEventsQuery, BuildWorkEventInput } from '../../core/work-events/domain';

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

  findAllAndCounted = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = BuildListWorkEventsQuery(req.query);
      const [data, count] = await this.workEventService.findAllAndCounted(query);
      const response = new CommonFilter(query).toPaginatedResult(data, count);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
