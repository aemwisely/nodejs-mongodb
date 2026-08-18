import { CommonFilter, BadRequestException } from '../../../../common';
import type { SortOrder } from 'mongoose';

import { User, type UserDocument } from '../../../../database/model';
import { NOT_DELETED_FILTER } from '../../../../database/plugins/soft-delete.plugin';
import type { CreateUserInput } from '../../application/dto/create-user.dto';
import type { ListUsersQuery } from '../../application/dto/list-users-query.dto';
import { UserEntity } from '../../domain/user.entity';
import type { UserRepository } from '../../domain/user.repository';

type UserPersistenceDocument = UserDocument & {
  _id: { toString(): string };
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toEntity = (document: UserPersistenceDocument): UserEntity =>
  UserEntity.create({
    id: document._id.toString(),
    firstName: document.firstName,
    lastName: document.lastName,
    phoneNumber: document.phoneNumber,
    isActive: document.isActive,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    deletedAt: document.deletedAt ?? null,
  });

export class MongooseUserRepository implements UserRepository {
  async create(input: CreateUserInput): Promise<UserEntity> {
    try {
      const document = await User.create({
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNumber: input.phoneNumber,
        isActive: input.isActive ?? true,
      });

      return toEntity(document);
    } catch (error) {
      if (this.isDuplicatePhoneNumberError(error)) {
        throw new BadRequestException({
          error_code: 'DUPLCIATED',
          error_message: 'User already exists',
        });
      }

      throw error;
    }
  }

  async findManyAndCount(query: ListUsersQuery): Promise<[UserEntity[], number]> {
    const { filter, sort, limit, offset, pagination } = this.buildQuery(query);
    const documentsQuery = User.find(filter).sort(sort);

    if (pagination) {
      documentsQuery.skip(offset).limit(limit);
    }

    const [documents, total] = await Promise.all([documentsQuery.exec(), User.countDocuments(filter).exec()]);

    return [documents.map((document) => toEntity(document)), total];
  }

  private buildQuery(query: ListUsersQuery): {
    filter: Record<string, unknown>;
    sort: Record<string, SortOrder>;
    limit: number;
    offset: number;
    pagination: boolean;
  } {
    const filter: Record<string, unknown> = { ...NOT_DELETED_FILTER };
    const commonFilter = new CommonFilter(query);

    if (typeof query.isActive === 'boolean') {
      filter.is_active = query.isActive;
    }

    if (query.name) {
      filter.$expr = {
        $regexMatch: {
          input: { $concat: ['$first_name', ' ', '$last_name'] },
          regex: escapeRegExp(query.name),
          options: 'i',
        },
      };
    }

    const sortFieldMap = {
      createdAt: 'created_at',
      firstName: 'first_name',
      lastName: 'last_name',
      phoneNumber: 'phone_number',
    } as const;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDirection: SortOrder = query.sortDirection === 'asc' ? 1 : -1;
    const limit = Math.min(commonFilter.limit, 100);
    const offset = commonFilter.getOffset({ page: commonFilter.page, limit });

    return {
      filter,
      sort: { [sortFieldMap[sortBy]]: sortDirection },
      limit,
      offset,
      pagination: commonFilter.pagination,
    };
  }

  private isDuplicatePhoneNumberError(error: unknown): boolean {
    return !!error && typeof error === 'object' && 'code' in error && (error as { code: unknown }).code === 11000;
  }
}
