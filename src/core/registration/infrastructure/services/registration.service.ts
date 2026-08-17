import { BadRequestException, NotFoundException } from '../../../../common';
import { isValidObjectId } from 'mongoose';
import type { RegisterEventInput } from '../../application/dto/register-event.dto';
import { AbstractRegistrationService } from '../../application/services/registration.service.abstract';
import type { RegistrationEntity } from '../../domain';
import type { RegistrationRepository } from '../../domain/registration.repository';

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
    const canReserveSeat = await this.registrationRepository.incrementRegisteredCountIfAvailable(event.id);

    if (!canReserveSeat) {
      await this.registrationRepository.deleteRegistrationById(registration.id);

      throw new BadRequestException({
        error_code: 'WORK_EVENT_FULL',
        error_message: 'Work event is full',
      });
    }

    return registration;
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
    if (!isValidObjectId(dto.eventId)) {
      throw new BadRequestException({
        error_code: 'INVALID_EVENT_ID',
        error_message: 'Event id is invalid',
      });
    }

    if (!dto.user.firstName.trim() || !dto.user.lastName.trim() || !dto.user.phoneNumber.trim()) {
      throw new BadRequestException({
        error_code: 'INVALID_REGISTER_EVENT_BODY',
        error_message: 'User first name, last name, and phone number are required',
      });
    }
  }
}
