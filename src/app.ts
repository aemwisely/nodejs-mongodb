import express from 'express';
import { corsOptions, setupSwagger, transformInterceptor } from './common';
import { appConfig } from './config/app.config';
import { apiRoutes } from './routes';
import cors from 'cors';

export const app = express();

app.use(express.json());
app.use(transformInterceptor);
app.use(cors(corsOptions));

setupSwagger(app, {
  serverName: 'Example API',
  description: 'This is an example API documentation',
  docsPath: `/${appConfig.prefix}/docs`,
});

app.use(`/${appConfig.prefix}`, apiRoutes);
