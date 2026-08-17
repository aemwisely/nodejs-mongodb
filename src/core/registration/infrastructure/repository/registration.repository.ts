import { BadRequestException, NotFoundException } from '../../../../common';
import { User, UserEvent, type UserEventDocument, WorkEvent } from '../../../../database';
import { isValidObjectId, Types } from 'mongoose';
import type { RegisterEventInput } from '../../application/dto/register-event.dto';
import { RegistrationEntity } from '../../domain/registration.entity';
import type { RegistrationRepository } from '../../domain/registration.repository';

type UserEventPersistenceDocument = UserEventDocument & {
  _id: { toString(): string };
};

const toEntity = (document: UserEventPersistenceDocument): RegistrationEntity =>
  RegistrationEntity.create({
    id: document._id.toString(),
    userId: document.userId.toString(),
    eventId: document.eventId.toString(),
    checkinAt: document.checkinAt,
    checkoutAt: document.checkoutAt,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  });

export class MongooseRegistrationRepository implements RegistrationRepository {
  async registerEvent(dto: RegisterEventInput): Promise<RegistrationEntity> {
    this.validateInput(dto);

    const eventObjectId = new Types.ObjectId(dto.eventId);
    const event = await WorkEvent.findById(eventObjectId).exec();

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

    const user = await User.findOneAndUpdate(
      { phone_number: dto.user.phoneNumber },
      {
        $setOnInsert: {
          first_name: dto.user.firstName,
          last_name: dto.user.lastName,
          phone_number: dto.user.phoneNumber,
          is_active: true,
        },
      },
      { new: true, upsert: true },
    ).exec();

    let userEventDocument: UserEventPersistenceDocument;

    try {
      userEventDocument = await UserEvent.create({
        user_id: user._id,
        event_id: eventObjectId,
      });
    } catch (error) {
      if (this.isDuplicateUserEventError(error)) {
        throw new BadRequestException({
          error_code: 'USER_ALREADY_REGISTERED',
          error_message: 'User already registered this event',
        });
      }

      throw error;
    }

    const updatedEvent = await WorkEvent.findOneAndUpdate(
      {
        _id: eventObjectId,
        is_active: true,
        $expr: { $lt: ['$registered_count', '$capacity'] },
      },
      { $inc: { registered_count: 1 } },
      { new: true },
    ).exec();

    if (!updatedEvent) {
      await UserEvent.deleteOne({ _id: userEventDocument._id }).exec();

      throw new BadRequestException({
        error_code: 'WORK_EVENT_FULL',
        error_message: 'Work event is full',
      });
    }

    return toEntity(userEventDocument);
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

  private isDuplicateUserEventError(error: unknown): boolean {
    return !!error && typeof error === 'object' && 'code' in error && (error as { code: unknown }).code === 11000;
  }
}
