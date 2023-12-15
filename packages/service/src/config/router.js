import Router from '@koa/router';
import userRouter from '../users/router.js';
import commonRouter from '../common/router.js';
import articleRouter from '../articles/router.js';
import commentRouter from '../comments/router.js';
import messageRouter from '../messages/router.js';
import notificationRouter from '../notifications/router.js';

const router = new Router({ prefix: '/api' });

router.use('/common', commonRouter.routes(), commonRouter.allowedMethods());
// 用户相关API
router.use('/users', userRouter.routes(), userRouter.allowedMethods());
// 文章相关API
router.use('/articles', articleRouter.routes(), articleRouter.allowedMethods());
// 评论相关API
router.use('/comments', commentRouter.routes(), commentRouter.allowedMethods());
// 消息通知相关API
router.use(
  '/notifications',
  notificationRouter.routes(),
  notificationRouter.allowedMethods(),
);

// 聊天通信相关API
router.use('/messages', messageRouter.routes(), messageRouter.allowedMethods());

export default router;
