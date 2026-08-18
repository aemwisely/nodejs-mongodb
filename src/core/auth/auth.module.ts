import { MongooseUserRepository } from '../user';
import { MongooseAuthRepository } from './infrastructure/repository';
import { AuthService } from './infrastructure/services';

export const createAuthModule = () => {
  const authRepository = new MongooseAuthRepository();
  const userRepository = new MongooseUserRepository();

  const authService = new AuthService(authRepository, userRepository);

  return {
    repositories: {
      authRepository,
    },
    services: {
      authService,
    },
  };
};
