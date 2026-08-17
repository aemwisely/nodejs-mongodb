export interface RegistrationProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  eventId: string;
  checkinAt: Date;
  checkoutAt: Date;
}

export interface RegistrationResponse {
  id: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  event_id: string;
  checkin_at: Date;
  checkout_at: Date;
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

  get checkinAt(): Date {
    return this.props.checkinAt;
  }

  get checkoutAt(): Date {
    return this.props.checkoutAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
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
    };
  }
}
