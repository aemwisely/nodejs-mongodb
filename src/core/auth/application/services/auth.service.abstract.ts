import type { LoginInput } from '../dto/login.dto';
import type { AuthTokenEntity } from '../../domain';
import type { UserEntity } from '../../../user';

export abstract class AbstractAuthService {
  abstract login(dto: LoginInput): Promise<AuthTokenEntity>;
  abstract getMe(user: Express.User): Promise<UserEntity>;
}
