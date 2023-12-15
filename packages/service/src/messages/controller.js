import service from './service.js';
import { successHttpBody } from '../utils/common.js';

const updateReadStatus = async ctx => {
  await service.updateReadStatus(ctx.request.body);
  ctx.body = { ...successHttpBody };
};

export default { updateReadStatus };
