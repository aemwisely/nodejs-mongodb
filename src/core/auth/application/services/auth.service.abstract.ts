import type { LoginInput } from '../dto/login.dto';
import type { AuthTokenEntity } from '../../domain';

export abstract class AbstractAuthService {
  abstract login(dto: LoginInput): Promise<AuthTokenEntity>;
}
