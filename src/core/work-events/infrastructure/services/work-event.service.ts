import type { CreateWorkEventInput } from '../../application/dto/create-work-event.dto';
import { AbstractWorkEventService } from '../../application/services/work-event.service.abstract';
import type { WorkEventRepository } from '../../domain/work-event.repository';

export class WorkEventService extends AbstractWorkEventService {
  constructor(private readonly workEventRepository: WorkEventRepository) {
    super();
  }

  createWorkEvent(dto: CreateWorkEventInput) {
    return this.workEventRepository.create(dto);
  }
}
