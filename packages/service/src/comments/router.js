import Router from '@koa/router';
import validate from '../middlewares/validation.js';
import controller from './controller.js';
import scheme from './scheme.js';

const router = new Router();

router.get('/public/count', validate(scheme.total), controller.getCommentCount);
router.get('/public/list', validate(scheme.list), controller.getComments);
router.post('/new', validate(scheme.create), controller.createComment);
router.delete('/:id', validate(scheme.remove), controller.deleteComment);

export default router;
