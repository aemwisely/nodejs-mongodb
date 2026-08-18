import { MongooseAuthRepository } from './infrastructure/repository';
import { AuthService } from './infrastructure/services';

export const createAuthModule = () => {
  const authRepository = new MongooseAuthRepository();
  const authService = new AuthService(authRepository);

  return {
    repositories: {
      authRepository,
    },
    services: {
      authService,
    },
  };
};
