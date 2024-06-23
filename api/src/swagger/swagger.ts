import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EML AdminTool API',
      version: '1.0.0',
      description: 'This API is used for the EML AdminTool',
      license: {
        name: 'GPL-3.0-or-later',
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API root',
      }
    ],
    components: {
      securitySchemes: {
        "basic": {
          type: 'http',
          scheme: 'basic'
        },
        "bearer": {
          type: 'http',
          scheme: 'bearer'
        }
      }
    },
    tags: [
      {
        name: 'Configuration',
        description: 'Configuration of the EML AdminTool'
      },
      {
        name: 'Auth',
        description: 'Login, register and logout'
      },
      {
        name: 'Admin',
        description: 'Admin and users actions'
      },
      {
        name: 'Environnement',
        description: 'Environnement of the EML AdminTool'
      },
      {
        name: 'Files Updater',
        description: 'Files that have to be downloaded by the Launcher'
      }
    ]
  },
  apis: ['./src/routers/**/*.ts'],
};

export default swaggerJSDoc(options);
