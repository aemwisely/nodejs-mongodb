import type { NextFunction, Request, Response } from 'express';

import { CommonFilter } from '../../common';
import { AbstractUserService } from '../../core/user';
import { BuildListUsersQuery, BuildUserInput } from '../../core/user/domain';

export class UsersController {
  constructor(private readonly userService: AbstractUserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = BuildUserInput(req.body);
      const user = await this.userService.createUser(dto);

      res.status(201).json({ result: user });
    } catch (error) {
      next(error);
    }
  };

  findAllAndCounted = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = BuildListUsersQuery(req.query);
      const [data, count] = await this.userService.findAllAndCounted(query);
      const response = new CommonFilter(query).toPaginatedResult(data, count);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
