export type UserRole = 'ADMIN' | 'USER';

export interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_active: boolean;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export class UserEntity {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  get id(): string {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get role(): UserRole {
    return this.props.role;
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

  toJSON(): UserResponse {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      phone_number: this.phoneNumber,
      is_active: this.isActive,
      role: this.role,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }
}
