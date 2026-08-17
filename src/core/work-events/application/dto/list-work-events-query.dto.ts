import type { CommonFilterOptions } from '../../../../common';

export type WorkEventSortBy = 'createdAt' | 'title' | 'capacity' | 'registeredCount';
export type SortDirection = 'asc' | 'desc';

export interface ListWorkEventsQuery extends CommonFilterOptions {
  title?: string;
  isActive?: boolean;
  sortBy?: WorkEventSortBy;
  sortDirection?: SortDirection;
}
