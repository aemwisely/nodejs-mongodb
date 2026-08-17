import type { CreateWorkEventInput } from '../../application/dto/create-work-event.dto';
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

  async findAllAndCounted(): Promise<[WorkEventEntity[], number]> {}
}
