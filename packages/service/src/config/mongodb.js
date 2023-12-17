import mongoose from 'mongoose';
import config from './config.js';
import logger from './logger.js';

mongoose
  .connect(config.db.mongodb, {
    maxPoolSize: 6,
    serverSelectionTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('mongodb connected'))
  .catch(err => logger.error('[mongodb]', err));

// 全局处理mongodb连接上发生的所有错误
// mongoose.connection.on('error', (err) => {
//   console.log(err)
// })
