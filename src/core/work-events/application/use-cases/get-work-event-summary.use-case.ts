import type { WorkEventRepository } from '../../domain/work-event.repository';

export class GetWorkEventSummaryUseCase {
  constructor(private readonly workEventRepository: WorkEventRepository) {}

  execute() {
    return this.workEventRepository.getSummary();
  }
}
