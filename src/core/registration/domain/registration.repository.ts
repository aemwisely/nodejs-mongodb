import type { RegisterEventInput } from '../application/dto/register-event.dto';
import type { RegistrationEntity } from './registration.entity';

export interface RegistrationRepository {
  registerEvent(dto: RegisterEventInput): Promise<RegistrationEntity>;
}
