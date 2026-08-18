import type { JoinEventType } from '../dto/join-event.dto';
import type { ListRegistrationUsersQuery } from '../dto/list-registration-users-query.dto';
import type { RegisterEventInput } from '../dto/register-event.dto';
import type { RegistrationEntity } from '../../domain/registration.entity';
import type { JwtPayload } from '../../../auth';
import type { UserEntity } from '../../../user/domain';

export abstract class AbstractRegistrationService {
  abstract registerEvent(dto: RegisterEventInput): Promise<RegistrationEntity>;
  abstract findListUserJoinEvent(
    eventId: string,
    query?: ListRegistrationUsersQuery,
    authUser?: JwtPayload,
  ): Promise<[UserEntity[], number]>;

  abstract handleJoinEvent(eventId: string, authUser: JwtPayload, type: JoinEventType): Promise<void>;
}
