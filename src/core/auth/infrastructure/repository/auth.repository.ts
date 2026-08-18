import { User } from '../../../../database';
import { NOT_DELETED_FILTER } from '../../../../database/plugins/soft-delete.plugin';
import type { AuthRepository, AuthUserRecord } from '../../domain';

export class MongooseAuthRepository implements AuthRepository {
  async findUserByPhoneNumber(phoneNumber: string): Promise<AuthUserRecord | null> {
    const document = await User.findOne({ phone_number: phoneNumber, ...NOT_DELETED_FILTER }).exec();

    if (!document) {
      return null;
    }

    return {
      id: document._id.toString(),
      phoneNumber: document.phoneNumber,
      role: document.role ?? 'USER',
      isActive: document.isActive,
    };
  }
}
