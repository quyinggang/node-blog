import Router from '@koa/router';
import validate from '../middlewares/validation.js';
import controller from './controller.js';
import scheme from './scheme.js';

const router = new Router();

router.get('/:id', validate(scheme.list), controller.getNotificationsByType);
router.put('/read', validate(scheme.read), controller.updateReadStatus);

export default router;
