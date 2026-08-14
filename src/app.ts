import express from 'express';
import { corsOptions, setupSwagger, transformInterceptor } from './common';
import { appConfig, getAppUrl } from './config/app.config';
import { apiRoutes } from './routes';
import cors from 'cors';

type ExpressAppWithUrl = ReturnType<typeof express> & {
  getUrl: () => string;
};

export const app = express() as ExpressAppWithUrl;

app.getUrl = getAppUrl;

app.use(express.json());
app.use(transformInterceptor);
app.use(cors(corsOptions));

setupSwagger(app, {
  serverName: 'Example API',
  description: 'This is an example API documentation',
  docsPath: `/${appConfig.prefix}/docs`,
  serverUrl: `${app.getUrl()}/${appConfig.prefix}/v${appConfig.defaultVersion}`,
});

app.use(`/${appConfig.prefix}`, apiRoutes);
