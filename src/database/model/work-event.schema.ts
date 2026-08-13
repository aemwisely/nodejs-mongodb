import { model, Schema } from 'mongoose';

const workEventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: false, trim: true },
    capacity: { type: Number, required: true, min: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { collection: 'work_events', timestamps: true },
);

export const WorkEvent = model('WorkEvent', workEventSchema);
