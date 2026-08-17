export interface CommonFilterOptions {
  page?: number;
  limit?: number;
  pagination?: boolean;
}

export class CommonFilter {
  page = 1;
  limit = 10;
  pagination = true;

  constructor(options: CommonFilterOptions = {}) {
    this.page = this.toPositiveNumber(options.page, this.page);
    this.limit = this.toPositiveNumber(options.limit, this.limit);
    this.pagination = typeof options.pagination === 'boolean' ? options.pagination : this.pagination;
  }

  get offset(): number {
    return this.getOffset(this);
  }

  getOffset(value: Pick<CommonFilter, 'page' | 'limit'>): number {
    return (value.page - 1) * value.limit;
  }

  getPageCount(limit: number, total: number): number {
    return Math.ceil(total / limit);
  }

  private toPositiveNumber(value: number | undefined, defaultValue: number): number {
    if (!Number.isFinite(value) || value === undefined || value < 1) {
      return defaultValue;
    }

    return Math.floor(value);
  }
}
