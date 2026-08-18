import type { UserRole } from '../../user/domain';

export interface JoinedUserEventProps {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  checkinAt?: Date | null;
  checkoutAt?: Date | null;
}

export interface JoinedUserEventResponse {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_active: boolean;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  checkin_at?: Date | null;
  checkout_at?: Date | null;
}

export class JoinedUserEventEntity {
  private constructor(private readonly props: JoinedUserEventProps) {}

  static create(props: JoinedUserEventProps): JoinedUserEventEntity {
    return new JoinedUserEventEntity(props);
  }

  toJSON(): JoinedUserEventResponse {
    return {
      id: this.props.id,
      first_name: this.props.firstName,
      last_name: this.props.lastName,
      phone_number: this.props.phoneNumber,
      is_active: this.props.isActive,
      role: this.props.role,
      created_at: this.props.createdAt,
      updated_at: this.props.updatedAt,
      deleted_at: this.props.deletedAt,
      checkin_at: this.props.checkinAt,
      checkout_at: this.props.checkoutAt,
    };
  }
}
