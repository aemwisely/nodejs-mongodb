import { model, Schema, Types } from 'mongoose';
import { softDeletePlugin, type SoftDeleteDocument } from '../plugins/soft-delete.plugin';

export interface UserEventDocument extends SoftDeleteDocument {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  checkinAt?: Date | null;
  checkoutAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  user_id: Types.ObjectId;
  event_id: Types.ObjectId;
  checkin_at?: Date | null;
  checkout_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

const userEventSchema = new Schema<UserEventDocument>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, alias: 'userId' },
    event_id: { type: Schema.Types.ObjectId, ref: 'WorkEvent', required: true, alias: 'eventId' },
    checkin_at: { type: Date, required: false, default: null, alias: 'checkinAt' },
    checkout_at: { type: Date, required: false, default: null, alias: 'checkoutAt' },
  },
  {
    collection: 'user_events',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

userEventSchema.index(
  { user_id: 1, event_id: 1 },
  { unique: true, partialFilterExpression: { deleted_at: null } },
);
userEventSchema.index({ event_id: 1 });
userEventSchema.index({ user_id: 1 });

userEventSchema.virtual('createdAt').get(function getCreatedAt() {
  return this.created_at;
});

userEventSchema.virtual('updatedAt').get(function getUpdatedAt() {
  return this.updated_at;
});

userEventSchema.plugin(softDeletePlugin);

export const UserEvent = model<UserEventDocument>('UserEvent', userEventSchema);
