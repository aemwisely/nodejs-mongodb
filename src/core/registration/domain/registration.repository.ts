import type { ListRegistrationUsersQuery } from '../application/dto/list-registration-users-query.dto';
import type { RegisterEventInput } from '../application/dto/register-event.dto';
import type { UserEntity } from '../../user/domain';
import type { RegistrationEntity } from './registration.entity';

export interface RegistrationUserRecord {
  id: string;
}

export interface RegistrationEventRecord {
  id: string;
  isActive: boolean;
}

export interface RegistrationRepository {
  findEventById(eventId: string): Promise<RegistrationEventRecord | null>;
  findOrCreateUserByPhoneNumber(user: RegisterEventInput['user']): Promise<RegistrationUserRecord>;
  createRegistration(input: { userId: string; eventId: string }): Promise<RegistrationEntity>;
  findUsersByEventId(eventId: string, query: ListRegistrationUsersQuery): Promise<[UserEntity[], number]>;
  reserveSeatIfAvailable(eventId: string): Promise<boolean>;
  deleteRegistrationById(registrationId: string): Promise<void>;
  isDuplicateRegistrationError(error: unknown): boolean;
}
