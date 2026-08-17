import { MongooseUserRepository } from './infrastructure/repository/user.repository';
import { UserService } from './infrastructure/services/user.service';

export const createUserModule = () => {
  const userRepository = new MongooseUserRepository();
  const userService = new UserService(userRepository);

  return {
    repositories: {
      userRepository,
    },
    services: {
      userService,
    },
  };
};
