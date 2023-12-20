import Router from '@koa/router';
import validate from '../middlewares/validation.js';
import controller from './controller.js';
import scheme from './scheme.js';

const router = new Router();

/**
 * @swagger
 * /api/articles/public/list:
 *    get:
 *      description: 分页获取文章列表
 *      tags: [文章模块API]
 *      parameters:
 *        - name: page
 *          description: 页数
 *          in: query
 *          type: number
 *          required: true
 *        - name: size
 *          description: 页条数
 *          in: query
 *          type: number
 *          required: true
 *      responses:
 *        200:
 *          description: 成功
 *
 */
router.get('/public/list', validate(scheme.list), controller.getList);

router.get('/public/:id', validate(scheme.article), controller.getArticle);
router.get(
  '/public/user/:id',
  validate(scheme.userArticle),
  controller.getUserArticles
);
router.put(
  '/public/read/:id',
  validate(scheme.readArticle),
  controller.readArticle
);
router.get('/drafts', validate(scheme.drafts), controller.getDrafts);
router.delete('/:id', validate(scheme.article), controller.deleteArticle);
router.post('/new', validate(scheme.publish), controller.publish);
router.post('/draft', validate(scheme.publish), controller.saveDraft);
router.put('/:id', validate(scheme.updateArticle), controller.updateArticle);

export default router;
