import { CommonFilter } from '../../../../common';
import { User, UserEvent, type UserEventDocument, WorkEvent } from '../../../../database';
import { NOT_DELETED_FILTER } from '../../../../database/plugins/soft-delete.plugin';
import { Types, type PipelineStage } from 'mongoose';
import type { ListRegistrationUsersQuery } from '../../application/dto/list-registration-users-query.dto';
import type { RegisterEventInput } from '../../application/dto/register-event.dto';
import { RegistrationEntity } from '../../domain/registration.entity';
import type {
  RegistrationEventRecord,
  RegistrationRepository,
  RegistrationUserRecord,
} from '../../domain/registration.repository';
import { UserEntity, type UserRole } from '../../../user/domain';

type UserEventPersistenceDocument = UserEventDocument & {
  _id: { toString(): string };
};

type JoinedUserRecord = {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_active: boolean;
  role?: UserRole;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toEntity = (document: UserEventPersistenceDocument): RegistrationEntity =>
  RegistrationEntity.create({
    id: document._id.toString(),
    userId: document.userId.toString(),
    eventId: document.eventId.toString(),
    checkinAt: document.checkinAt,
    checkoutAt: document.checkoutAt,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    deletedAt: document.deletedAt ?? null,
  });

const toUserEntity = (document: JoinedUserRecord): UserEntity =>
  UserEntity.create({
    id: document._id.toString(),
    firstName: document.first_name,
    lastName: document.last_name,
    phoneNumber: document.phone_number,
    isActive: document.is_active,
    role: document.role ?? 'USER',
    createdAt: document.created_at,
    updatedAt: document.updated_at,
    deletedAt: document.deleted_at ?? null,
  });

export class MongooseRegistrationRepository implements RegistrationRepository {
  async findEventById(eventId: string): Promise<RegistrationEventRecord | null> {
    const event = await WorkEvent.findOne({ _id: new Types.ObjectId(eventId), ...NOT_DELETED_FILTER }).exec();

    if (!event) {
      return null;
    }

    return {
      id: event._id.toString(),
      isActive: event.isActive,
    };
  }

  async findOrCreateUserByPhoneNumber(user: RegisterEventInput['user']): Promise<RegistrationUserRecord> {
    const document = await User.findOneAndUpdate(
      { phone_number: user.phoneNumber, ...NOT_DELETED_FILTER },
      {
        $setOnInsert: {
          first_name: user.firstName,
          last_name: user.lastName,
          phone_number: user.phoneNumber,
          is_active: true,
          role: 'USER',
        },
      },
      { new: true, upsert: true },
    ).exec();

    return { id: document._id.toString() };
  }

  async createRegistration(input: { userId: string; eventId: string }): Promise<RegistrationEntity> {
    const document = await UserEvent.create({
      user_id: new Types.ObjectId(input.userId),
      event_id: new Types.ObjectId(input.eventId),
    });

    return toEntity(document);
  }

  async findUsersByEventId(eventId: string, query: ListRegistrationUsersQuery): Promise<[UserEntity[], number]> {
    const { pipeline, sort, limit, offset, pagination } = this.buildFindUsersByEventIdQuery(eventId, query);
    const documentsPipeline: PipelineStage[] = [...pipeline, { $sort: sort }];

    if (pagination) {
      documentsPipeline.push({ $skip: offset }, { $limit: limit });
    }

    documentsPipeline.push({
      $project: {
        _id: '$user._id',
        first_name: '$user.first_name',
        last_name: '$user.last_name',
        phone_number: '$user.phone_number',
        is_active: '$user.is_active',
        role: '$user.role',
        created_at: '$user.created_at',
        updated_at: '$user.updated_at',
        deleted_at: '$user.deleted_at',
      },
    });

    const [documents, totalDocuments] = await Promise.all([
      UserEvent.aggregate<JoinedUserRecord>(documentsPipeline).exec(),
      UserEvent.aggregate<{ count: number }>([...pipeline, { $count: 'count' }]).exec(),
    ]);

    return [documents.map((document) => toUserEntity(document)), totalDocuments[0]?.count ?? 0];
  }

  async reserveSeatIfAvailable(eventId: string): Promise<boolean> {
    const updatedEvent = await WorkEvent.findOneAndUpdate(
      {
        _id: new Types.ObjectId(eventId),
        is_active: true,
        ...NOT_DELETED_FILTER,
        $expr: { $lt: ['$registered_count', '$capacity'] },
      },
      [
        {
          $set: {
            registered_count: { $add: ['$registered_count', 1] },
          },
        },
        {
          $set: {
            is_active: { $lt: ['$registered_count', '$capacity'] },
          },
        },
      ],
      { new: true },
    ).exec();

    return !!updatedEvent;
  }

  async deleteRegistrationById(registrationId: string): Promise<void> {
    await UserEvent.updateOne(
      { _id: new Types.ObjectId(registrationId), ...NOT_DELETED_FILTER },
      { $set: { deleted_at: new Date() } },
    ).exec();
  }

  isDuplicateRegistrationError(error: unknown): boolean {
    return !!error && typeof error === 'object' && 'code' in error && (error as { code: unknown }).code === 11000;
  }

  private buildFindUsersByEventIdQuery(
    eventId: string,
    query: ListRegistrationUsersQuery,
  ): {
    pipeline: PipelineStage[];
    sort: Record<string, 1 | -1>;
    limit: number;
    offset: number;
    pagination: boolean;
  } {
    const commonFilter = new CommonFilter(query);
    const pipeline: PipelineStage[] = [
      { $match: { event_id: new Types.ObjectId(eventId), ...NOT_DELETED_FILTER } },
      {
        $lookup: {
          from: 'user',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $match: { 'user.deleted_at': null } },
    ];

    if (typeof query.isActive === 'boolean') {
      pipeline.push({ $match: { 'user.is_active': query.isActive } });
    }

    if (query.name) {
      pipeline.push({
        $match: {
          $expr: {
            $regexMatch: {
              input: { $concat: ['$user.first_name', ' ', '$user.last_name'] },
              regex: escapeRegExp(query.name),
              options: 'i',
            },
          },
        },
      });
    }

    const sortFieldMap = {
      createdAt: 'user.created_at',
      firstName: 'user.first_name',
      lastName: 'user.last_name',
      phoneNumber: 'user.phone_number',
    } as const;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
    const limit = Math.min(commonFilter.limit, 100);
    const offset = commonFilter.getOffset({ page: commonFilter.page, limit });

    return {
      pipeline,
      sort: { [sortFieldMap[sortBy]]: sortDirection },
      limit,
      offset,
      pagination: commonFilter.pagination,
    };
  }
}
