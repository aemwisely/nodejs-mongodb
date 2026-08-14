import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { bodySchemas } from '../../docs';

interface SwaggerSetupOptions {
  serverName: string;
  description: string;
  docsPath?: string;
  serverUrl: string;
}

const swaggerSpec = (option: SwaggerSetupOptions) => {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: option.serverName,
        version: '1.0.0',
        description: option.description,
      },
      servers: [
        {
          url: option.serverUrl,
          description: 'Development Server',
        },
      ],
      components: {
        schemas: {
          ...bodySchemas,
        },
      },
    },

    // path ที่ Swagger จะ scan comment
    apis: ['./dist/src/routes/**/*.js', './dist/src/modules/**/*.js'],
  };

  return swaggerJsdoc(options);
};

export const setupSwagger = (app: Express, option: SwaggerSetupOptions) => {
  const docsPath = option.docsPath ?? '/docs';
  const docsJsonPath = `${docsPath.replace(/\/$/, '')}-json`;

  app.use(
    docsPath,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec(option), {
      explorer: true,
    }),
  );

  // OpenAPI JSON
  app.get(docsJsonPath, (_, res) => {
    res.json(swaggerSpec(option));
  });
};
