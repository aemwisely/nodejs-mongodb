import mongoose from "mongoose";

import { env } from "./env";

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  return mongoose;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
