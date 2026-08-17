import { UserEvent, UserEventDocument } from '../../../../database';
import { RegistrationEntity } from '../../domain/registration.entity';
import { RegistrationRepository } from '../../domain/registration.repository';

type UserEventPersistenceDocument = UserEventDocument & {
  _id: { toString(): string };
};

const toEntity = (document: UserEventPersistenceDocument): RegistrationEntity =>
  UserEvent.create({
    id: document._id.toString(),
    userId: document.userId,
    eventId: document.eventId,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  });

export class MongooseRegistrationRepository implements RegistrationRepository {
  create(dto: { userId: string; eventId: string }): Promise<any> {
    const createRegisterEvent = UserEvent.create({ user_id: dto.userId, event_id: dto.eventId });
  }
}
