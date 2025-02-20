import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EML AdminTool API',
      version: '2.0.0-alpha.12',
      description: 'This API is used for the EML AdminTool',
      license: {
        name: 'GPL-3.0-or-later'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API root'
      }
    ],
    components: {
      securitySchemes: {
        basic: {
          type: 'http',
          scheme: 'basic'
        },
        bearer: {
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
      },
      {
        name: 'Bootstraps',
        description: 'Files to download and update the Launcher'
      },
      {
        name: 'Maintenance',
        description: 'Maintenance status of the the Launcher and/or Minecraft server'
      },
      {
        name: 'News',
        description: 'News to display in the Launcher'
      },
      {
        name: 'Backgrounds',
        description: 'The backgrounds of the Launcher'
      },
      {
        name: 'Stats',
        description: 'Stats of the Launcher'
      },
      {
        name: 'Update',
        description: 'Update the EML AdminTool'
      }
    ]
  },
  apis: ['./src/routers/**/*.ts']
}

export default swaggerJSDoc(options)
