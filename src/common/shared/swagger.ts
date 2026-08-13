import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

interface SwaggerSetupOptions {
  serverName: string;
  description: string;
  docsPath?: string;
}

const swaggerSpec = (option: SwaggerSetupOptions) => {
  const options: swaggerJsdoc.Options = {
    definition: {
      info: {
        title: option.serverName,
        version: '1.0.0',
        description: option.description,
      },
      servers: [
        {
          url: 'http://localhost:4000/api/v1',
          description: 'Development Server',
        },
      ],
      // components: {
      //   securitySchemes: {
      //     bearerAuth: {
      //       type: 'http',
      //       scheme: 'bearer',
      //       bearerFormat: 'JWT',
      //     },
      //   },
      // },
    },

    // path ที่ Swagger จะ scan comment
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
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
