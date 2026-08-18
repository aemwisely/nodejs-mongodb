import type { UserRole } from '../../domain';

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive?: boolean;
  role?: UserRole;
}
