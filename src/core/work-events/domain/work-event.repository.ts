import type { CreateWorkEventInput } from '../application/dto/create-work-event.dto';
import type { ListWorkEventsQuery } from '../application/dto/list-work-events-query.dto';
import type { UpdateWorkEventDto } from '../application/dto/update-work-event.dto';
import type { WorkEventEntity } from './work-event.entity';

export interface WorkEventSummary {
  totalCapacity: number;
  totalRegistered: number;
  totalRemaining: number;
}

export interface WorkEventRepository {
  create(input: CreateWorkEventInput): Promise<WorkEventEntity>;
  update(input: UpdateWorkEventDto): Promise<WorkEventEntity | null>;
  findMany(query: ListWorkEventsQuery): Promise<WorkEventEntity[]>;
  findManyAndCount(query: ListWorkEventsQuery): Promise<[WorkEventEntity[], number]>;
  findById(id: string): Promise<WorkEventEntity | null>;
  getSummary(): Promise<WorkEventSummary>;
}
