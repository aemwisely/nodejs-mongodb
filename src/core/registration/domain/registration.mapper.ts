import { CommonFilter } from '../../../common';
import type {
  ListRegistrationUsersQuery,
  RegistrationUserSortDirection,
  RegistrationUserSortBy,
} from '../application/dto/list-registration-users-query.dto';
import type { RegisterEventInput } from '../application/dto/register-event.dto';

export function BuildRegisterEventInput(eventId: string, body: unknown): RegisterEventInput {
  const payload = body as {
    firstName?: string;
    first_name?: string;
    lastName?: string;
    last_name?: string;
    phoneNumber?: string;
    phone_number?: string;
  };

  return {
    eventId,
    user: {
      firstName: payload.firstName ?? payload.first_name ?? '',
      lastName: payload.lastName ?? payload.last_name ?? '',
      phoneNumber: payload.phoneNumber ?? payload.phone_number ?? '',
    },
  };
}

export function BuildListRegistrationUsersQuery(query: unknown): ListRegistrationUsersQuery {
  const payload = query as Record<string, unknown>;
  const filter = new CommonFilter({
    page: toOptionalNumber(payload.page),
    limit: toOptionalNumber(payload.limit),
    pagination: toOptionalBoolean(payload.pagination),
  });

  return {
    name: toOptionalString(payload.name),
    isActive: toOptionalBoolean(payload.isActive),
    sortBy: toRegistrationUserSortBy(payload.sortBy),
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

const toRegistrationUserSortBy = (value: unknown): RegistrationUserSortBy | undefined => {
  if (value === 'createdAt' || value === 'firstName' || value === 'lastName' || value === 'phoneNumber') {
    return value;
  }

  return undefined;
};

const toSortDirection = (value: unknown): RegistrationUserSortDirection | undefined => {
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
