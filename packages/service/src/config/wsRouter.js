import Router from '@koa/router';
import MessageProxy from '../messages/proxy.js';

const router = new Router({ prefix: '/ws' });

router.get('/chat', MessageProxy.chatByWebSocket);

router.get('/users', MessageProxy.userConnectByWebSocket);

export default router;
