import Router from '@koa/router';
import { koaBody } from 'koa-body';
import pathTool from '../utils/path.cjs';
import controller from './controller.js';
import validate from '../middlewares/validation.js';
import scheme from './scheme.js';

const router = new Router();

router.post(
  '/upload',
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 5 * 1024 * 1024,
      uploadDir: pathTool.getStaticPath(),
    },
  }),
  controller.uploadFile
);

router.get(
  '/information/count',
  validate(scheme.count),
  controller.getUnreadCount
);

export default router;
