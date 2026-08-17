import { model, Schema } from 'mongoose';

export interface WorkEventDocument {
  title: string;
  description?: string | null;
  type: string;
  capacity: number;
  registered_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const workEventSchema = new Schema<WorkEventDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: false, trim: true },
    capacity: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, trim: true },
    registered_count: { type: Number, required: true, default: 0, min: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  {
    collection: 'work_events',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const WorkEvent = model<WorkEventDocument>('WorkEvent', workEventSchema);
