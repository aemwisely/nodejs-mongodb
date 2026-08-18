import type { CreateUserInput } from '../application/dto/create-user.dto';
import type { ListUsersQuery } from '../application/dto/list-users-query.dto';
import type { UserEntity } from './user.entity';

export interface UserRepository {
  create(input: CreateUserInput): Promise<UserEntity>;
  findManyAndCount(query: ListUsersQuery): Promise<[UserEntity[], number]>;
  findOneById(id: string): Promise<UserEntity | null>;
}
