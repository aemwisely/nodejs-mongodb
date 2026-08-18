import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const emptyStringToUndefined = (value: unknown): unknown =>
  value === "" ? undefined : value;

const stringToBoolean = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  if (["true", "1", "yes", "on"].includes(value.toLowerCase())) {
    return true;
  }

  if (["false", "0", "no", "off", ""].includes(value.toLowerCase())) {
    return false;
  }

  return value;
};

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(3000),
  MONGODB_HOST: z.string().min(1, "MONGODB_HOST is required").default("127.0.0.1"),
  MONGODB_PORT: z.coerce.number().int().positive().max(65535).default(27017),
  MONGODB_DATABASE: z.string().min(1, "MONGODB_DATABASE is required").default("nodejs"),
  MONGODB_USERNAME: z.preprocess(emptyStringToUndefined, z.string().optional()),
  MONGODB_PASSWORD: z.preprocess(emptyStringToUndefined, z.string().optional()),
  MONGODB_AUTH_SOURCE: z.string().min(1).default("admin"),
  AUTO_INIT_DATABASE: z.preprocess(stringToBoolean, z.boolean()).default(false),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required").default("change-me"),
  JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(3600),
}).superRefine((value, context) => {
  if (Boolean(value.MONGODB_USERNAME) !== Boolean(value.MONGODB_PASSWORD)) {
    context.addIssue({
      code: "custom",
      message: "MONGODB_USERNAME and MONGODB_PASSWORD must be provided together",
      path: ["MONGODB_USERNAME"]
    });
  }
});

export const env = envSchema.parse(process.env);

export type Env = typeof env;
