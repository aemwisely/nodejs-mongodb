import jwt from 'jsonwebtoken';

import { BadRequestException, ForbiddenException, UnauthorizedException } from '../../../../common';
import { env } from '../../../../config/env';
import { AbstractAuthService } from '../../application/services/auth.service.abstract';
import { AuthTokenEntity, type JwtPayload } from '../../domain';
import type { LoginInput } from '../../application/dto/login.dto';
import type { AuthRepository } from '../../domain/auth.repository';
import { UserEntity, UserRepository } from '../../../user';

export class AuthService implements AbstractAuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getMe(user: Express.User): Promise<UserEntity> {
    const findUserEntity = await this.userRepository.findOneById(user.id);

    if (!findUserEntity) {
      throw new UnauthorizedException({
        error_code: 'INVALID_CREDENTIALS',
        error_message: 'Invalid phone number',
      });
    }

    return findUserEntity;
  }

  async login(dto: LoginInput): Promise<AuthTokenEntity> {
    const phoneNumber = dto.phoneNumber.trim();

    if (!phoneNumber) {
      throw new BadRequestException({
        error_code: 'INVALID_LOGIN_BODY',
        error_message: 'Phone number is required',
      });
    }

    const user = await this.authRepository.findUserByPhoneNumber(phoneNumber);

    if (!user) {
      throw new UnauthorizedException({
        error_code: 'INVALID_CREDENTIALS',
        error_message: 'Invalid phone number',
      });
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        error_code: 'USER_INACTIVE',
        error_message: 'User is inactive',
      });
    }

    const payload: JwtPayload = {
      id: user.id,
      phone_number: user.phoneNumber,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    });

    return AuthTokenEntity.create({
      accessToken,
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      user: payload,
    });
  }
}
