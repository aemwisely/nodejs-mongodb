import { MongooseRegistrationRepository } from './infrastructure/repository/registration.repository';
import { RegistrationService } from './infrastructure/services/registration.service';

export const createRegistrationModule = () => {
  const registrationRepository = new MongooseRegistrationRepository();
  const registrationService = new RegistrationService(registrationRepository);

  return {
    repositories: {
      registrationRepository,
    },
    services: {
      registrationService,
    },
  };
};
