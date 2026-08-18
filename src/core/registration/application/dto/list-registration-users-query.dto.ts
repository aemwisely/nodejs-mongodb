import type { CommonFilterOptions } from '../../../../common';

export type RegistrationUserSortBy = 'createdAt' | 'firstName' | 'lastName' | 'phoneNumber';
export type RegistrationUserSortDirection = 'asc' | 'desc';

export interface ListRegistrationUsersQuery extends CommonFilterOptions {
  name?: string;
  isActive?: boolean;
  sortBy?: RegistrationUserSortBy;
  sortDirection?: RegistrationUserSortDirection;
}
