import service from './service.js';
import { successHttpBody } from '../utils/common.js';

const getNotificationsByType = async ctx => {
  const data = await service.getNotificationsByType({
    uid: ctx.params.id,
    ...(ctx.query || {}),
  });
  ctx.body = { ...successHttpBody, data };
};

const updateReadStatus = async ctx => {
  await service.updateReadStatus(ctx.request.body);
  ctx.body = { ...successHttpBody };
};

export default {
  getNotificationsByType,
  updateReadStatus,
};
