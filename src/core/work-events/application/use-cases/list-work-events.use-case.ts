import type { ListWorkEventsQuery } from '../dto/list-work-events-query.dto';
import type { WorkEventRepository } from '../../domain/work-event.repository';

export class ListWorkEventsUseCase {
  constructor(private readonly workEventRepository: WorkEventRepository) {}

  execute(query: ListWorkEventsQuery = {}) {
    return this.workEventRepository.findMany(query);
  }
}
