const config = {
  db: {
    mongodb: 'mongodb://0.0.0.0:27017/test',
    redis: 'redis://default:123456@0.0.0.0:6379/0',
  },
  token: {
    secret: 'node-project@www.localhost.me@2023&10',
    accessTokenExpire: '2h',
    refreshTokenExpire: '7d',
  },
  hashSalt: 'me@14.06',
  api: {
    whiteRecord: [/\/public\//, /^\/static/, /^\/swagger/],
  },
};

export default config;
