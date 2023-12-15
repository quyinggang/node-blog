import unless from 'koa-unless';
import { checkRedisKeyExistStatus } from '../utils/redis.js';
import { getTokenFromRequestHeader } from '../utils/common.js';

// token黑名单机制：拦截redis中失效token的请求
export default () => {
  const middleware = async (ctx, next) => {
    try {
      const token = await getTokenFromRequestHeader(ctx.header);
      if (!token) {
        ctx.throw(401, 'Token not found');
      }
      const isExist = await checkRedisKeyExistStatus(token);
      if (isExist) {
        ctx.throw(401, 'Token invalid');
      }
    } catch (err) {
      ctx.throw(401, err);
    }
    return next();
  };
  middleware.unless = unless;
  return middleware;
};
