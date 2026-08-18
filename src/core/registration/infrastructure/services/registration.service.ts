import { BadRequestException, CommonFilter, ForbiddenException, NotFoundException } from '../../../../common';
import { isValidObjectId } from 'mongoose';
import type { JoinEventType } from '../../application/dto/join-event.dto';
import type { ListRegistrationUsersQuery } from '../../application/dto/list-registration-users-query.dto';
import type { RegisterEventInput } from '../../application/dto/register-event.dto';
import { AbstractRegistrationService } from '../../application/services/registration.service.abstract';
import type { RegistrationEntity } from '../../domain';
import type { RegistrationRepository } from '../../domain/registration.repository';
import type { JwtPayload } from '../../../auth';
import type { UserEntity } from '../../../user/domain';

export class RegistrationService extends AbstractRegistrationService {
  constructor(private readonly registrationRepository: RegistrationRepository) {
    super();
  }

  async registerEvent(dto: RegisterEventInput): Promise<RegistrationEntity> {
    this.validateInput(dto);

    const event = await this.registrationRepository.findEventById(dto.eventId);

    if (!event) {
      throw new NotFoundException({
        error_code: 'WORK_EVENT_NOT_FOUND',
        error_message: 'Work event not found',
      });
    }

    if (!event.isActive) {
      throw new BadRequestException({
        error_code: 'WORK_EVENT_INACTIVE',
        error_message: 'Work event is inactive',
      });
    }

    const user = await this.registrationRepository.findOrCreateUserByPhoneNumber(dto.user);
    const registration = await this.createRegistration(user.id, event.id);
    const canReserveSeat = await this.registrationRepository.reserveSeatIfAvailable(event.id);

    if (!canReserveSeat) {
      await this.registrationRepository.deleteRegistrationById(registration.id);

      throw new BadRequestException({
        error_code: 'WORK_EVENT_FULL',
        error_message: 'Work event is full',
      });
    }

    return registration;
  }

  async findListUserJoinEvent(
    eventId: string,
    query: ListRegistrationUsersQuery = {},
    authUser?: JwtPayload,
  ): Promise<[UserEntity[], number]> {
    this.validateEventId(eventId);

    const event = await this.registrationRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException({
        error_code: 'WORK_EVENT_NOT_FOUND',
        error_message: 'Work event not found',
      });
    }

    await this.validateCanListUserJoinEvent(event.id, authUser);

    return this.registrationRepository.findUsersByEventId(event.id, this.buildListQuery(query));
  }

  private async createRegistration(userId: string, eventId: string): Promise<RegistrationEntity> {
    try {
      return await this.registrationRepository.createRegistration({ userId, eventId });
    } catch (error) {
      if (this.registrationRepository.isDuplicateRegistrationError(error)) {
        throw new BadRequestException({
          error_code: 'USER_ALREADY_REGISTERED',
          error_message: 'User already registered this event',
        });
      }

      throw error;
    }
  }

  private validateInput(dto: RegisterEventInput): void {
    this.validateEventId(dto.eventId);

    if (!dto.user.firstName.trim() || !dto.user.lastName.trim() || !dto.user.phoneNumber.trim()) {
      throw new BadRequestException({
        error_code: 'INVALID_REGISTER_EVENT_BODY',
        error_message: 'User first name, last name, and phone number are required',
      });
    }
  }

  private validateEventId(eventId: string): void {
    if (!isValidObjectId(eventId)) {
      throw new BadRequestException({
        error_code: 'INVALID_EVENT_ID',
        error_message: 'Event id is invalid',
      });
    }
  }

  private async validateCanListUserJoinEvent(eventId: string, authUser?: JwtPayload): Promise<void> {
    if (!authUser || authUser.role === 'ADMIN') {
      return;
    }

    const isJoinedEvent = await this.registrationRepository.existsUserEvent({
      eventId,
      userId: authUser.id,
    });

    if (!isJoinedEvent) {
      throw new ForbiddenException({
        error_code: 'FORBIDDEN_RESOURCE',
        error_message: "Can't access this resource",
      });
    }
  }

  private buildListQuery(query: ListRegistrationUsersQuery): ListRegistrationUsersQuery {
    const filter = new CommonFilter(query);

    return {
      ...query,
      page: filter.page,
      limit: filter.limit,
      pagination: filter.pagination,
      name: query.name?.trim() || undefined,
    };
  }

  async handleJoinEvent(eventId: string, authUser: JwtPayload, type: JoinEventType): Promise<void> {
    this.validateEventId(eventId);

    const event = await this.registrationRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException({
        error_code: 'WORK_EVENT_NOT_FOUND',
        error_message: 'Work event not found',
      });
    }

    await this.validateCanListUserJoinEvent(event.id, authUser);
    await this.registrationRepository.updateUserEventJoinState({ eventId: event.id, userId: authUser.id, type });
  }
}
