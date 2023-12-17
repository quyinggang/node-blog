import Router from '@koa/router';
import validate from '../middlewares/validation.js';
import controller from './controller.js';
import scheme from './scheme.js';

const router = new Router();

router.get('/record', validate(scheme.list), controller.getMessages);
router.put('/read', validate(scheme.read), controller.updateMessageReadStatus);
router.post(
  '/delete',
  validate(scheme.deleteMessage),
  controller.deleteMessages
);

export default router;
