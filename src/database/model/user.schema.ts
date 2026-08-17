import { model, Schema } from 'mongoose';

export interface UserDocument {
  first_name: string;
  last_name: string;
  phone_number: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    phone_number: { type: String, required: true, trim: true, unique: true },
    is_active: { type: Boolean, required: true, default: true, alias: 'isActive' },
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

export const User = model<UserDocument>('User', userSchema);
