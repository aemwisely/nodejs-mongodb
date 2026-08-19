import { BadRequestException, CommonFilter, NotFoundException } from '../../../../common';
import type { CreateWorkEventInput } from '../../application/dto/create-work-event.dto';
import type { ListWorkEventsQuery } from '../../application/dto/list-work-events-query.dto';
import type { UpdateWorkEventDto } from '../../application/dto/update-work-event.dto';
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

  async updateWorkEvent(dto: UpdateWorkEventDto): Promise<WorkEventEntity> {
    const workEvent = await this.workEventRepository.findById(dto.eventId);

    if (!workEvent) {
      throw new NotFoundException({
        error_code: 'WORK_EVENT_NOT_FOUND',
        error_message: 'Work event not found',
      });
    }

    const updatePayload = this.updateBuilder(dto);

    if (Object.keys(updatePayload).length === 1) {
      throw new BadRequestException({
        error_code: 'WORK_EVENT_UPDATE_BODY_REQUIRED',
        error_message: 'At least one work event field is required',
      });
    }

    if (typeof updatePayload.capacity === 'number' && updatePayload.capacity < workEvent.registeredCount) {
      throw new BadRequestException({
        error_code: 'WORK_EVENT_CAPACITY_LESS_THAN_REGISTERED',
        error_message: 'Capacity cannot be less than registered count',
      });
    }

    const updatedWorkEvent = await this.workEventRepository.update(updatePayload);

    if (!updatedWorkEvent) {
      throw new NotFoundException({
        error_code: 'WORK_EVENT_NOT_FOUND',
        error_message: 'Work event not found',
      });
    }

    return updatedWorkEvent;
  }

  async findAllAndCounted(query: ListWorkEventsQuery = {}): Promise<[WorkEventEntity[], number]> {
    return this.workEventRepository.findManyAndCount(this.queryBuilder(query));
  }

  async findById(id: string): Promise<WorkEventEntity | null> {
    return this.workEventRepository.findById(id);
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

  private updateBuilder(dto: UpdateWorkEventDto): UpdateWorkEventDto {
    if (typeof dto.capacity === 'number' && (!Number.isFinite(dto.capacity) || dto.capacity < 0)) {
      throw new BadRequestException({
        error_code: 'WORK_EVENT_CAPACITY_INVALID',
        error_message: 'Capacity must be a number greater than or equal to 0',
      });
    }

    return {
      eventId: dto.eventId,
      ...(dto.title ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.type ? { type: dto.type } : {}),
      ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
      ...(typeof dto.isActive === 'boolean' ? { isActive: dto.isActive } : {}),
    };
  }
}
