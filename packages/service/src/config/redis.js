import Redis from 'ioredis';
import config from './config.js';
import logger from './logger.js';

const redisClient = new Redis(config.db.redis);

redisClient.on('connect', () => {
  logger.info('redis connected');
});

redisClient.on('error', err => {
  logger.error('[redis]', err);
});

export default redisClient;
