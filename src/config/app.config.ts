import { env } from './env';

export const appConfig = {
  prefix: 'api',
  defaultVersion: '1',
  host: 'localhost',
} as const;

export const getAppUrl = (): string => `http://${appConfig.host}:${env.PORT}`;
