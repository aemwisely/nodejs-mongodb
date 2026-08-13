import type { CreateWorkEventInput } from '../dto/create-work-event.dto';
import type { WorkEventRepository } from '../../domain/work-event.repository';

export class CreateWorkEventUseCase {
  constructor(private readonly workEventRepository: WorkEventRepository) {}

  execute(input: CreateWorkEventInput) {
    return this.workEventRepository.create(input);
  }
}
