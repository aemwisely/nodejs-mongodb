import type { UserRole } from '../../user/domain';

export interface AuthUserRecord {
  id: string;
  phoneNumber: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthRepository {
  findUserByPhoneNumber(phoneNumber: string): Promise<AuthUserRecord | null>;
}
