import mongoose from "mongoose";

import { env } from "./env";

const buildMongoConnectionString = (): string => {
  const credentials =
    env.MONGODB_USERNAME && env.MONGODB_PASSWORD
      ? `${encodeURIComponent(env.MONGODB_USERNAME)}:${encodeURIComponent(env.MONGODB_PASSWORD)}@`
      : "";

  return `mongodb://${credentials}${env.MONGODB_HOST}:${env.MONGODB_PORT}/${encodeURIComponent(
    env.MONGODB_DATABASE
  )}`;
};

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const options: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 5000
  };

  if (env.MONGODB_USERNAME && env.MONGODB_PASSWORD) {
    options.authSource = env.MONGODB_AUTH_SOURCE;
  }

  await mongoose.connect(buildMongoConnectionString(), options);

  return mongoose;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
