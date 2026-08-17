import { User, UserEvent, type UserEventDocument, WorkEvent } from '../../../../database';
import { Types } from 'mongoose';
import type { RegisterEventInput } from '../../application/dto/register-event.dto';
import { RegistrationEntity } from '../../domain/registration.entity';
import type {
  RegistrationEventRecord,
  RegistrationRepository,
  RegistrationUserRecord,
} from '../../domain/registration.repository';

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
  async findEventById(eventId: string): Promise<RegistrationEventRecord | null> {
    const event = await WorkEvent.findById(new Types.ObjectId(eventId)).exec();

    if (!event) {
      return null;
    }

    return {
      id: event._id.toString(),
      isActive: event.isActive,
    };
  }

  async findOrCreateUserByPhoneNumber(user: RegisterEventInput['user']): Promise<RegistrationUserRecord> {
    const document = await User.findOneAndUpdate(
      { phone_number: user.phoneNumber },
      {
        $setOnInsert: {
          first_name: user.firstName,
          last_name: user.lastName,
          phone_number: user.phoneNumber,
          is_active: true,
        },
      },
      { new: true, upsert: true },
    ).exec();

    return { id: document._id.toString() };
  }

  async createRegistration(input: { userId: string; eventId: string }): Promise<RegistrationEntity> {
    const document = await UserEvent.create({
      user_id: new Types.ObjectId(input.userId),
      event_id: new Types.ObjectId(input.eventId),
    });

    return toEntity(document);
  }

  async reserveSeatIfAvailable(eventId: string): Promise<boolean> {
    const updatedEvent = await WorkEvent.findOneAndUpdate(
      {
        _id: new Types.ObjectId(eventId),
        is_active: true,
        $expr: { $lt: ['$registered_count', '$capacity'] },
      },
      [
        {
          $set: {
            registered_count: { $add: ['$registered_count', 1] },
          },
        },
        {
          $set: {
            is_active: { $lt: ['$registered_count', '$capacity'] },
          },
        },
      ],
      { new: true },
    ).exec();

    return !!updatedEvent;
  }

  async deleteRegistrationById(registrationId: string): Promise<void> {
    await UserEvent.deleteOne({ _id: new Types.ObjectId(registrationId) }).exec();
  }

  isDuplicateRegistrationError(error: unknown): boolean {
    return !!error && typeof error === 'object' && 'code' in error && (error as { code: unknown }).code === 11000;
  }
}
