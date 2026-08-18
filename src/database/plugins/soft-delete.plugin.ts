import type { Schema } from 'mongoose';

export interface SoftDeleteDocument {
  deletedAt?: Date | null;
  deleted_at?: Date | null;
}

export const NOT_DELETED_FILTER = { deleted_at: null } as const;

export const softDeletePlugin = (schema: Schema): void => {
  schema.add({
    deleted_at: { type: Date, required: false, default: null, alias: 'deletedAt', index: true },
  });

  schema.virtual('deletedAt').get(function getDeletedAt(this: SoftDeleteDocument) {
    return this.deleted_at;
  });
};
