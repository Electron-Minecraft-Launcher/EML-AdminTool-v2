import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EML AdminTool API',
      version: '1.0.0',
      description: 'This API is used for the EML AdminTool',
    }
  },
  apis: ['/api/routes/*.js'],
};

export default swaggerJSDoc(options);