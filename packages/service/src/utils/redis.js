import redisClient from '../config/redis.js';

const UPLOADS_KEY = 'uploads';

export const setRedisKeyWithExpireTime = async (key, value, ms) => {
  return redisClient.pipeline().set(key, value).pexpire(key, ms).exec();
};

export const checkRedisKeyExistStatus = async key => {
  const result = await redisClient.exists(key);
  return result === 1;
};

export const cacheUploadFileIntoSet = value => {
  return redisClient.sadd(UPLOADS_KEY, value);
};

export const removeUploadFileFromSet = value => {
  return redisClient.srem(UPLOADS_KEY, value);
};

export const clearAllUploadCache = () => {
  return redisClient.unlink(UPLOADS_KEY);
};
