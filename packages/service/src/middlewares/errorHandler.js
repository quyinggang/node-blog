import logger from '../config/logger.js';

const typeMap = {
  authorizedError: 'UnauthorizedError',
  businessError: 'BusinessError',
};

const handlerMap = {
  [typeMap.authorizedError]: message => {
    return { code: 50000, message };
  },
  [typeMap.businessError]: message => {
    return { code: 50001, message };
  },
};

const errorHandler = error => {
  const name = String(error.name || '').trim();
  const message = error.message;
  const handler = handlerMap[name];
  return handler ? handler(message) : false;
};

export default () => {
  const middleware = async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404) {
        const { url, method } = ctx.request;
        logger.error(`404 Not Found - ${method} ${url}`);
      }
    } catch (err) {
      // 有针对性的错误需要额外处理，接口状态成功但是需要自定义的错误code以便前端进行相关逻辑处理
      const result = errorHandler(err);
      if (result) {
        logger.error(err.stack || err);
        ctx.status = 200;
        ctx.body = { ...result };
        return;
      }
      // 对于其他错误交由app error事件处理，并且设置HTTP ERROR
      ctx.throw(err);
    }
  };
  return middleware;
};
