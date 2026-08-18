import { model, Schema } from 'mongoose';
import { softDeletePlugin, type SoftDeleteDocument } from '../plugins/soft-delete.plugin';

export interface WorkEventDocument extends SoftDeleteDocument {
  title: string;
  description?: string | null;
  type: string;
  capacity: number;
  registeredCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  registered_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

const workEventSchema = new Schema<WorkEventDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: false, trim: true },
    capacity: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, trim: true },
    registered_count: { type: Number, required: true, default: 0, min: 0, alias: 'registeredCount' },
    is_active: { type: Boolean, required: true, default: true, alias: 'isActive' },
  },
  {
    collection: 'work_events',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

workEventSchema.virtual('createdAt').get(function getCreatedAt() {
  return this.created_at;
});

workEventSchema.virtual('updatedAt').get(function getUpdatedAt() {
  return this.updated_at;
});

workEventSchema.plugin(softDeletePlugin);

export const WorkEvent = model<WorkEventDocument>('WorkEvent', workEventSchema);
