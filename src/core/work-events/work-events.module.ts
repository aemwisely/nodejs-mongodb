import { CreateWorkEventUseCase } from './application/use-cases/create-work-event.use-case';
import { GetWorkEventSummaryUseCase } from './application/use-cases/get-work-event-summary.use-case';
import { ListWorkEventsUseCase } from './application/use-cases/list-work-events.use-case';
import { MongooseWorkEventRepository } from './infrastructure/repository/work-event.repository';
import { WorkEventService } from './infrastructure/services/work-event.service';

export const createWorkEventsModule = () => {
  const workEventRepository = new MongooseWorkEventRepository();
  const workEventService = new WorkEventService(workEventRepository);

  return {
    repositories: {
      workEventRepository,
    },
    services: {
      workEventService,
    },
    useCases: {
      createWorkEvent: new CreateWorkEventUseCase(workEventRepository),
      listWorkEvents: new ListWorkEventsUseCase(workEventRepository),
      getWorkEventSummary: new GetWorkEventSummaryUseCase(workEventRepository),
    },
  };
};
