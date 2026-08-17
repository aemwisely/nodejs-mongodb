import { CommonFilter } from '../../../../common';
import type { CreateUserInput } from '../../application/dto/create-user.dto';
import type { ListUsersQuery } from '../../application/dto/list-users-query.dto';
import { AbstractUserService } from '../../application/services/user.service.abstract';
import { UserEntity } from '../../domain';
import type { UserRepository } from '../../domain/user.repository';

export class UserService extends AbstractUserService {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async createUser(dto: CreateUserInput): Promise<UserEntity> {
    return this.userRepository.create(dto);
  }

  async findAllAndCounted(query: ListUsersQuery = {}): Promise<[UserEntity[], number]> {
    return this.userRepository.findManyAndCount(this.queryBuilder(query));
  }

  private queryBuilder(query: ListUsersQuery): ListUsersQuery {
    const name = query.name?.trim();
    const filter = new CommonFilter(query);

    return {
      ...(name ? { name } : {}),
      ...(typeof query.isActive === 'boolean' ? { isActive: query.isActive } : {}),
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      page: filter.page,
      limit: filter.limit,
      pagination: filter.pagination,
    };
  }
}
