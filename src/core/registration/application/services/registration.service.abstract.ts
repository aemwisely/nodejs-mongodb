import { CreateRegisterEvent } from '../dto/register-event.dto';

export abstract class AbstractRegistrationService {
  abstract registerEvent(dto: CreateRegisterEvent): Promise<any>;
}
