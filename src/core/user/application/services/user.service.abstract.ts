import type { CreateUserInput } from '../dto/create-user.dto';
import type { ListUsersQuery } from '../dto/list-users-query.dto';
import type { UserEntity } from '../../domain/user.entity';

export abstract class AbstractUserService {
  abstract createUser(dto: CreateUserInput): Promise<UserEntity>;
  abstract findAllAndCounted(query?: ListUsersQuery): Promise<[UserEntity[], number]>;
}
