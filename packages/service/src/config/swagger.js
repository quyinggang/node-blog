import swaggerJsDoc from 'swagger-jsdoc';
import { koaSwagger } from 'koa2-swagger-ui';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'node-blog API Doc',
      version: '1.0.0',
      description: 'node-blog接口文档',
    },
    securityDefinitions: {
      jwtAuth: {
        type: 'http',
        scheme: 'Bearer',
      },
    },
  },
  apis: ['../**/router.js'],
};

export default koaSwagger({
  routePrefix: '/swagger',
  swaggerOptions: { spec: swaggerJsDoc(options) },
});
