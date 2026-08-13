export interface WorkEventProps {
  id: string;
  title: string;
  description?: string;
  capacity: number;
  registeredCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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

  toJSON(): WorkEventProps & { remainingCount: number } {
    return {
      ...this.props,
      remainingCount: this.remainingCount,
    };
  }
}
