import mongoose from 'mongoose';
import { env } from '../config/env';
import * as models from './model';

const getRegisteredModels = (): mongoose.Model<unknown>[] => Object.values(models) as mongoose.Model<unknown>[];

const ensureCollection = async (model: mongoose.Model<unknown>): Promise<void> => {
  const database = model.db.db;

  if (!database) {
    throw new Error(`MongoDB database is not ready for model ${model.modelName}`);
  }

  const collectionExists = await database
    .listCollections({ name: model.collection.name }, { nameOnly: true })
    .hasNext();

  if (!collectionExists) {
    await model.createCollection();
  }
};

export const initializeDatabase = async (): Promise<void> => {
  for (const model of getRegisteredModels()) {
    await ensureCollection(model);

    if (env.NODE_ENV === 'production') {
      await model.createIndexes();
      continue;
    }

    await model.syncIndexes();
  }
};
