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
  };
};
