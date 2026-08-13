import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    info: {
      title: 'Example API',
      version: '1.0.0',
      description: 'ExpressJS API Documentation',
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

const swaggerSpec = (option: { serverName: string; description: string }) => {
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

export const setupSwagger = (app: Express, option: { serverName: string; description: string }) => {
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec(option), {
      explorer: true,
    }),
  );

  // OpenAPI JSON
  app.get('/docs-json', (_, res) => {
    res.json(swaggerSpec(option));
  });
};
