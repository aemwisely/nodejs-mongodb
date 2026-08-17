import { CommonFilter } from '../../../../common';
import type { CreateWorkEventInput } from '../../application/dto/create-work-event.dto';
import type { ListWorkEventsQuery } from '../../application/dto/list-work-events-query.dto';
import { AbstractWorkEventService } from '../../application/services/work-event.service.abstract';
import { WorkEventEntity } from '../../domain';
import type { WorkEventRepository } from '../../domain/work-event.repository';

export class WorkEventService extends AbstractWorkEventService {
  constructor(private readonly workEventRepository: WorkEventRepository) {
    super();
  }

  async createWorkEvent(dto: CreateWorkEventInput) {
    const entity = await this.workEventRepository.create(dto);
    return entity;
  }

  async findAllAndCounted(query: ListWorkEventsQuery = {}): Promise<[WorkEventEntity[], number]> {
    return this.workEventRepository.findManyAndCount(this.queryBuilder(query));
  }

  private queryBuilder(query: ListWorkEventsQuery): ListWorkEventsQuery {
    const title = query.title?.trim();
    const filter = new CommonFilter(query);

    return {
      ...(title ? { title } : {}),
      ...(typeof query.isActive === 'boolean' ? { isActive: query.isActive } : {}),
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      page: filter.page,
      limit: filter.limit,
      pagination: filter.pagination,
    };
  }
}
