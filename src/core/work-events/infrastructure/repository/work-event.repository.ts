import type { SortOrder } from 'mongoose';

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
    capacity: document.capacity,
    registeredCount: document.registered_count ?? 0,
    isActive: document.is_active,
    createdAt: document.created_at,
    updatedAt: document.updated_at,
  });

export class MongooseWorkEventRepository implements WorkEventRepository {
  async create(input: CreateWorkEventInput): Promise<WorkEventEntity> {
    const document = await WorkEvent.create({
      title: input.title,
      description: input.description,
      type: input.type,
      capacity: input.capacity,
      registered_count: 0,
      is_active: input.isActive ?? true,
    });

    return toEntity(document);
  }

  async findMany(query: ListWorkEventsQuery): Promise<WorkEventEntity[]> {
    const { filter, sort, limit, offset } = this.buildQuery(query);

    const documents = await WorkEvent.find(filter)
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .exec();

    return documents.map((document) => toEntity(document));
  }

  async findManyAndCount(query: ListWorkEventsQuery): Promise<[WorkEventEntity[], number]> {
    const { filter, sort, limit, offset } = this.buildQuery(query);

    const [documents, total] = await Promise.all([
      WorkEvent.find(filter).sort(sort).skip(offset).limit(limit).exec(),
      WorkEvent.countDocuments(filter).exec(),
    ]);

    return [documents.map((document) => toEntity(document)), total];
  }

  private buildQuery(query: ListWorkEventsQuery): {
    filter: Record<string, unknown>;
    sort: Record<string, SortOrder>;
    limit: number;
    offset: number;
  } {
    const filter: Record<string, unknown> = {};

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
    const limit = Math.min(query.limit ?? 50, 100);
    const offset = query.offset ?? 0;

    return {
      filter,
      sort: { [sortFieldMap[sortBy]]: sortDirection },
      limit,
      offset,
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
