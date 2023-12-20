import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import compress from 'koa-compress';
import staticServe from 'koa-static';
import mount from 'koa-mount';
import jwt from 'koa-jwt';
import rateLimit from 'koa-ratelimit';
import './config/mongodb.js';
import limitConfig from './config/limit.js';
import config from './config/config.js';
import httpRouter from './config/httpRouter.js';
import wsRouter from './config/wsRouter.js';
import logger from './config/logger.js';
import redisToken from './middlewares/redisToken.js';
import requestLog from './middlewares/requestLog.js';
import errorHandler from './middlewares/errorHandler.js';
import responseHandler from './middlewares/responseHandler.js';
import pathTool from './utils/path.cjs';
import socketKoa from './utils/socketKoa.js';
import swagger from './config/swagger.js';

const app = socketKoa.proxy(new Koa());

// 接口限流
app.use(rateLimit(limitConfig));
// 接口文档
app.use(swagger);
// 自定义错误信息，与全局错误error配合使用
app.use(errorHandler());
// 请求日志
app.use(requestLog());
// 开启压缩
app.use(compress());
// 统一返回格式
app.use(responseHandler());
// 接口CORS配置
app.use(cors());
// token校验
app.use(
  jwt({ secret: config.token.secret }).unless({ path: config.api.whiteRecord })
);
// 校验注销token
app.use(redisToken().unless({ path: config.api.whiteRecord }));
// 接口请求http body内容解析
app.use(koaBody());
// 注册HTTP接口API
app.use(httpRouter.routes());
app.use(httpRouter.allowedMethods());

// 注册WS 接口API
socketKoa.use(wsRouter.routes());
socketKoa.use(wsRouter.allowedMethods());

// 静态资源服务
app.use(
  mount(
    '/static',
    staticServe(pathTool.getStaticPath(), {
      maxage: 7 * 24 * 60 * 60 * 1000,
      setHeaders: (res, path) => {
        if (path.indexOf('awebp') > -1) {
          res.setHeader('Content-Type', 'image/webp');
        }
      },
    })
  )
);

// 全局错误处理
app.on('error', (err, ctx) => {
  logger.error(`${ctx.method} ${ctx.url}`);
  logger.error(err.stack || err);
});

export default app;
