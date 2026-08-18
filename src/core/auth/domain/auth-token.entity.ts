import type { UserRole } from '../../user/domain';

export interface JwtPayload {
  id: string;
  phone_number: string;
  role: UserRole;
}

export interface AuthTokenProps {
  accessToken: string;
  expiresIn: number;
  user: JwtPayload;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: JwtPayload;
}

export class AuthTokenEntity {
  private constructor(private readonly props: AuthTokenProps) {}

  static create(props: AuthTokenProps): AuthTokenEntity {
    return new AuthTokenEntity(props);
  }

  get accessToken(): string {
    return this.props.accessToken;
  }

  get expiresIn(): number {
    return this.props.expiresIn;
  }

  get user(): JwtPayload {
    return this.props.user;
  }

  toJSON(): AuthTokenResponse {
    return {
      access_token: this.accessToken,
      token_type: 'Bearer',
      expires_in: this.expiresIn,
      user: this.user,
    };
  }
}
