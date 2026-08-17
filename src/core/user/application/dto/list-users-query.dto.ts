import type { CommonFilterOptions } from '../../../../common';

export type UserSortBy = 'createdAt' | 'firstName' | 'lastName' | 'phoneNumber';
export type SortDirection = 'asc' | 'desc';

export interface ListUsersQuery extends CommonFilterOptions {
  name?: string;
  isActive?: boolean;
  sortBy?: UserSortBy;
  sortDirection?: SortDirection;
}
