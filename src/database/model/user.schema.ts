import { model, Schema } from 'mongoose';
import { softDeletePlugin, type SoftDeleteDocument } from '../plugins/soft-delete.plugin';
import type { UserRole } from '../../core/user/domain';

export interface UserDocument extends SoftDeleteDocument {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  role: UserRole;
}

const userSchema = new Schema<UserDocument>(
  {
    first_name: { type: String, required: true, trim: true, alias: 'firstName' },
    last_name: { type: String, required: true, trim: true, alias: 'lastName' },
    phone_number: { type: String, required: true, trim: true, alias: 'phoneNumber' },
    is_active: { type: Boolean, required: true, default: true, alias: 'isActive' },
    role: { type: String, required: true, enum: ['ADMIN', 'USER'], default: 'USER' },
  },
  {
    collection: 'user',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

userSchema.virtual('createdAt').get(function getCreatedAt() {
  return this.created_at;
});

userSchema.virtual('updatedAt').get(function getUpdatedAt() {
  return this.updated_at;
});

userSchema.plugin(softDeletePlugin);
userSchema.index({ phone_number: 1 }, { unique: true, partialFilterExpression: { deleted_at: null } });

export const User = model<UserDocument>('User', userSchema);
