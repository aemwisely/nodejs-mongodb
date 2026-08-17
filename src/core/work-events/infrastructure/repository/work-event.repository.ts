import { CommonFilter } from '../../../../common';
import { isValidObjectId, type SortOrder } from 'mongoose';

import { WorkEvent, type WorkEventDocument } from '../../../../database/model';
import type { CreateWorkEventInput } from '../../application/dto/create-work-event.dto';
import type { ListWorkEventsQuery } from '../../application/dto/list-work-events-query.dto';
import { WorkEventEntity } from '../../domain/work-event.entity';
import type { WorkEventRepository, WorkEventSummary } from '../../domain/work-event.repository';

type WorkEventPersistenceDocument = WorkEventDocument & {
  _id: { toString(): string };
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toEntity = (document: WorkEventPersistenceDocument): WorkEventEntity =>
  WorkEventEntity.create({
    id: document._id.toString(),
    title: document.title,
    description: document.description ?? undefined,
    type: document.type,
    capacity: document.capacity,
    registeredCount: document.registeredCount ?? 0,
    isActive: document.isActive,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  });

export class MongooseWorkEventRepository implements WorkEventRepository {
  async create(input: CreateWorkEventInput): Promise<WorkEventEntity> {
    const document = await WorkEvent.create({
      title: input.title,
      description: input.description,
      type: input.type,
      capacity: input.capacity,
      registeredCount: 0,
      isActive: input.isActive ?? true,
    });

    return toEntity(document);
  }

  async findMany(query: ListWorkEventsQuery): Promise<WorkEventEntity[]> {
    const { filter, sort, limit, offset, pagination } = this.buildQuery(query);

    const documentsQuery = WorkEvent.find(filter).sort(sort);

    if (pagination) {
      documentsQuery.skip(offset).limit(limit);
    }

    const documents = await documentsQuery.exec();

    return documents.map((document) => toEntity(document));
  }

  async findManyAndCount(query: ListWorkEventsQuery): Promise<[WorkEventEntity[], number]> {
    const { filter, sort, limit, offset, pagination } = this.buildQuery(query);
    const documentsQuery = WorkEvent.find(filter).sort(sort);

    if (pagination) {
      documentsQuery.skip(offset).limit(limit);
    }

    const [documents, total] = await Promise.all([
      documentsQuery.exec(),
      WorkEvent.countDocuments(filter).exec(),
    ]);

    return [documents.map((document) => toEntity(document)), total];
  }

  async findById(id: string): Promise<WorkEventEntity | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const document = await WorkEvent.findById(id).exec();

    return document ? toEntity(document) : null;
  }

  private buildQuery(query: ListWorkEventsQuery): {
    filter: Record<string, unknown>;
    sort: Record<string, SortOrder>;
    limit: number;
    offset: number;
    pagination: boolean;
  } {
    const filter: Record<string, unknown> = {};
    const commonFilter = new CommonFilter(query);

    if (typeof query.isActive === 'boolean') {
      filter.is_active = query.isActive;
    }

    if (query.title) {
      filter.title = { $regex: escapeRegExp(query.title), $options: 'i' };
    }

    const sortFieldMap = {
      createdAt: 'created_at',
      title: 'title',
      capacity: 'capacity',
      registeredCount: 'registered_count',
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

  async getSummary(): Promise<WorkEventSummary> {
    const [summary] = await WorkEvent.aggregate<WorkEventSummary>([
      { $match: { is_active: true } },
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          totalRegistered: { $sum: { $ifNull: ['$registered_count', 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalCapacity: 1,
          totalRegistered: 1,
          totalRemaining: { $max: [{ $subtract: ['$totalCapacity', '$totalRegistered'] }, 0] },
        },
      },
    ]);

    return summary ?? { totalCapacity: 0, totalRegistered: 0, totalRemaining: 0 };
  }
}
