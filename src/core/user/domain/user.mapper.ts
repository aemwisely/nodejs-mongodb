import { CommonFilter } from '../../../common';
import type { CreateUserInput } from '../application/dto/create-user.dto';
import type { ListUsersQuery, SortDirection, UserSortBy } from '../application/dto/list-users-query.dto';

export function BuildUserInput(body: unknown): CreateUserInput {
  const payload = body as Partial<CreateUserInput> & {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    is_active?: boolean;
  };

  return {
    firstName: payload.firstName ?? payload.first_name ?? '',
    lastName: payload.lastName ?? payload.last_name ?? '',
    phoneNumber: payload.phoneNumber ?? payload.phone_number ?? '',
    isActive: payload.isActive ?? payload.is_active,
  };
}

export function BuildListUsersQuery(query: unknown): ListUsersQuery {
  const payload = query as Record<string, unknown>;
  const filter = new CommonFilter({
    page: toOptionalNumber(payload.page),
    limit: toOptionalNumber(payload.limit),
    pagination: toOptionalBoolean(payload.pagination),
  });

  return {
    name: toOptionalString(payload.name),
    isActive: toOptionalBoolean(payload.isActive),
    sortBy: toUserSortBy(payload.sortBy),
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

const toUserSortBy = (value: unknown): UserSortBy | undefined => {
  if (value === 'createdAt' || value === 'firstName' || value === 'lastName' || value === 'phoneNumber') {
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
