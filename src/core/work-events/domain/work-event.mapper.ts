import { CommonFilter } from '../../../common';
import type { CreateWorkEventInput } from '../application/dto/create-work-event.dto';
import type { ListWorkEventsQuery, SortDirection, WorkEventSortBy } from '../application/dto/list-work-events-query.dto';

export function BuildWorkEventInput(body: unknown): CreateWorkEventInput {
  const payload = body as Partial<CreateWorkEventInput> & { is_active?: boolean };

  return {
    title: payload.title ?? '',
    description: payload.description,
    type: payload.type ?? '',
    capacity: Number(payload.capacity),
    isActive: payload.isActive ?? payload.is_active,
  };
}

export function BuildListWorkEventsQuery(query: unknown): ListWorkEventsQuery {
  const payload = query as Record<string, unknown>;
  const filter = new CommonFilter({
    page: toOptionalNumber(payload.page),
    limit: toOptionalNumber(payload.limit),
    pagination: toOptionalBoolean(payload.pagination),
  });

  return {
    title: toOptionalString(payload.title),
    isActive: toOptionalBoolean(payload.isActive),
    sortBy: toWorkEventSortBy(payload.sortBy),
    sortDirection: toSortDirection(payload.sortDirection),
    page: filter.page,
    limit: filter.limit,
    pagination: filter.pagination,
  };
}

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
};

const toOptionalBoolean = (value: unknown): boolean | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  if (['true', '1'].includes(value.toLowerCase())) {
    return true;
  }

  if (['false', '0'].includes(value.toLowerCase())) {
    return false;
  }

  return undefined;
};

const toWorkEventSortBy = (value: unknown): WorkEventSortBy | undefined => {
  if (value === 'createdAt' || value === 'title' || value === 'capacity' || value === 'registeredCount') {
    return value;
  }

  return undefined;
};

const toSortDirection = (value: unknown): SortDirection | undefined => {
  if (value === 'asc' || value === 'desc') {
    return value;
  }

  return undefined;
};

const toOptionalNumber = (value: unknown): number | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : undefined;
};
