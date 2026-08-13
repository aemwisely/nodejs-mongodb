export type WorkEventSortBy = 'createdAt' | 'title' | 'capacity' | 'registeredCount';
export type SortDirection = 'asc' | 'desc';

export interface ListWorkEventsQuery {
  search?: string;
  isActive?: boolean;
  sortBy?: WorkEventSortBy;
  sortDirection?: SortDirection;
  limit?: number;
  offset?: number;
}
