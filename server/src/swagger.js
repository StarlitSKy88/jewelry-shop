import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '珠宝商城 API',
      version: '1.0.0',
      description: '珠宝商城后台API文档',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000/api',
        description: '开发服务器',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

export const specs = swaggerJsdoc(options); 