export interface RegistrationProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  eventId: string;
  checkinAt?: Date | null;
  checkoutAt?: Date | null;
  deletedAt?: Date | null;
}

export interface RegistrationResponse {
  id: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  event_id: string;
  checkin_at?: Date | null;
  checkout_at?: Date | null;
  deleted_at?: Date | null;
}

export class RegistrationEntity {
  private constructor(private readonly props: RegistrationProps) {}

  static create(props: RegistrationProps): RegistrationEntity {
    return new RegistrationEntity(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get checkinAt(): Date | null | undefined {
    return this.props.checkinAt;
  }

  get checkoutAt(): Date | null | undefined {
    return this.props.checkoutAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  toJSON(): RegistrationResponse {
    return {
      id: this.id,
      user_id: this.userId,
      event_id: this.eventId,
      checkin_at: this.checkinAt,
      checkout_at: this.checkoutAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }
}
