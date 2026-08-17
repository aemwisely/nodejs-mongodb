import type { CreateWorkEventInput } from '../dto/create-work-event.dto';
import type { ListWorkEventsQuery } from '../dto/list-work-events-query.dto';
import type { WorkEventEntity } from '../../domain/work-event.entity';

export abstract class AbstractWorkEventService {
  abstract createWorkEvent(dto: CreateWorkEventInput): Promise<WorkEventEntity>;
  abstract findAllAndCounted(query?: ListWorkEventsQuery): Promise<[WorkEventEntity[], number]>;
  abstract findById(id: string): Promise<WorkEventEntity | null>;
}
