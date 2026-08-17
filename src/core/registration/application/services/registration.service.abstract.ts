import type { RegisterEventInput } from '../dto/register-event.dto';
import type { RegistrationEntity } from '../../domain/registration.entity';

export abstract class AbstractRegistrationService {
  abstract registerEvent(dto: RegisterEventInput): Promise<RegistrationEntity>;
}
