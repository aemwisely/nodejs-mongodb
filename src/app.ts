import express from 'express';
import {
  allExceptionsFilter,
  configureJwtStrategy,
  corsOptions,
  NotFoundException,
  setupSwagger,
  transformInterceptor,
} from './common';
import { appConfig, getAppUrl } from './config/app.config';
import { apiRoutes } from './routes';
import cors from 'cors';
import passport from 'passport';

type ExpressAppWithUrl = ReturnType<typeof express> & {
  getUrl: () => string;
};

export const app = express() as ExpressAppWithUrl;

app.getUrl = getAppUrl;
configureJwtStrategy();

app.use(express.json());
app.use(transformInterceptor);
app.use(cors(corsOptions));
app.use(passport.initialize());

setupSwagger(app, {
  serverName: 'Example API',
  description: 'This is an example API documentation',
  docsPath: `/${appConfig.prefix}/docs`,
  serverUrl: `${app.getUrl()}`,
});

app.use(`/${appConfig.prefix}`, apiRoutes);
app.use((request, _response, next) => {
  next(
    new NotFoundException({
      error_code: 'ROUTE_NOT_FOUND',
      error_message: `Cannot ${request.method} ${request.url}`,
    }),
  );
});
app.use(allExceptionsFilter);
