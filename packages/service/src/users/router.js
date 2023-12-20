import Router from '@koa/router';
import { koaBody } from 'koa-body';
import validate from '../middlewares/validation.js';
import controller from './controller.js';
import scheme from './scheme.js';
import pathTool from '../utils/path.cjs';

const router = new Router();

router.post(
  '/avatar/upload',
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 5 * 1024 * 1024,
      uploadDir: pathTool.getStaticPath(),
    },
  }),
  controller.uploadAvatarFile
);

/**
 * @swagger
 * /api/users/info:
 *    get:
 *      description: 依据token获取用户基本信息
 *      tags: [用户模块API]
 *      parameters:
 *        - name: Authorization
 *          description: Bearer token authentication
 *          in: header
 *          required: true
 *      security:
 *        - jwtAuth: []
 *      responses:
 *        200:
 *          description: 成功
 *
 */
router.get('/info', controller.getBasicInfoByToken);
router.get(
  '/public/follower',
  validate(scheme.followList),
  controller.getFollowerList
);
router.get(
  '/public/following',
  validate(scheme.followList),
  controller.getFollowingList
);
router.get('/public/:id', validate(scheme.user), controller.getUserAllInfo);
router.post('/public/login', validate(scheme.login), controller.login);
router.post(
  '/public/refresh',
  validate(scheme.refresh),
  controller.refreshToken
);
router.post('/public/follow', validate(scheme.follow), controller.follow);

router.get('/relation', validate(scheme.relation), controller.getUserRelation);
router.delete('/logout', controller.logout);
router.put(
  '/relation/cancel',
  validate(scheme.follow),
  controller.cancelFollow
);
router.put('/profile', validate(scheme.profile), controller.updateProfile);
router.put(
  '/password',
  validate(scheme.updatePassword),
  controller.updatePassword
);
router.delete(
  '/:id',
  validate(scheme.revokedAccount),
  controller.revokedAccount
);

export default router;
