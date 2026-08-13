import { CreateWorkEventUseCase } from './application/use-cases/create-work-event.use-case';
import { GetWorkEventSummaryUseCase } from './application/use-cases/get-work-event-summary.use-case';
import { ListWorkEventsUseCase } from './application/use-cases/list-work-events.use-case';
import { MongooseWorkEventRepository } from './infrastructure/persistence/mongoose-work-event.repository';

export const createWorkEventsModule = () => {
  const workEventRepository = new MongooseWorkEventRepository();

  return {
    repositories: {
      workEventRepository,
    },
    useCases: {
      createWorkEvent: new CreateWorkEventUseCase(workEventRepository),
      listWorkEvents: new ListWorkEventsUseCase(workEventRepository),
      getWorkEventSummary: new GetWorkEventSummaryUseCase(workEventRepository),
    },
  };
};
