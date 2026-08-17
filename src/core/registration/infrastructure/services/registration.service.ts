import type { RegisterEventInput } from '../../application/dto/register-event.dto';
import { AbstractRegistrationService } from '../../application/services/registration.service.abstract';
import type { RegistrationEntity } from '../../domain';
import type { RegistrationRepository } from '../../domain/registration.repository';

export class RegistrationService extends AbstractRegistrationService {
  constructor(private readonly registrationRepository: RegistrationRepository) {
    super();
  }

  async registerEvent(dto: RegisterEventInput): Promise<RegistrationEntity> {
    return this.registrationRepository.registerEvent(dto);
  }
}
