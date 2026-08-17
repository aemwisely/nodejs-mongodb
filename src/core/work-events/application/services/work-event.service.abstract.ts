import type { CreateWorkEventInput } from '../dto/create-work-event.dto';
import type { WorkEventEntity } from '../../domain/work-event.entity';

export abstract class AbstractWorkEventService {
  abstract createWorkEvent(dto: CreateWorkEventInput): Promise<WorkEventEntity>;
  abstract findAllAndCounted(): Promise<[WorkEventEntity[], number]>;
}
