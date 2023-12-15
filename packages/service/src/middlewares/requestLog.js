import logger from '../config/logger.js';

export default () => {
  return async (ctx, next) => {
    const start = Date.now();
    await next();
    if (ctx.status === 200) {
      const duration = Date.now() - start;
      logger.info(`${ctx.method} ${ctx.url} - ${duration}ms`);
    }
  };
};
