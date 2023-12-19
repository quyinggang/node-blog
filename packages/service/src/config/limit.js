import redisClient from './redis.js';

export default {
  driver: 'redis',
  db: redisClient,
  duration: 60000,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  id: ctx => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  max: 100,
  disableHeader: false,
};
