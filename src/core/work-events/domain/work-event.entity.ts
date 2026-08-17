export interface WorkEventProps {
  id: string;
  title: string;
  description?: string;
  type: string;
  capacity: number;
  registeredCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkEventResponse {
  id: string;
  title: string;
  description?: string;
  type: string;
  capacity: number;
  registered_count: number;
  remaining_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class WorkEventEntity {
  private constructor(private readonly props: WorkEventProps) {}

  static create(props: WorkEventProps): WorkEventEntity {
    return new WorkEventEntity(props);
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get type(): string {
    return this.props.type;
  }

  get capacity(): number {
    return this.props.capacity;
  }

  get registeredCount(): number {
    return this.props.registeredCount;
  }

  get remainingCount(): number {
    return Math.max(this.capacity - this.registeredCount, 0);
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): WorkEventResponse {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      capacity: this.capacity,
      registered_count: this.registeredCount,
      remaining_count: this.remainingCount,
      is_active: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
