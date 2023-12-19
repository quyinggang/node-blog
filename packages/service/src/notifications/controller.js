import service from './service.js';

const getNotificationsByType = async ctx => {
  const data = await service.getNotificationsByType({
    uid: ctx.params.id,
    ...(ctx.query || {}),
  });
  ctx.body = data;
};

const updateReadStatus = async ctx => {
  await service.updateReadStatus(ctx.request.body);
};

export default {
  getNotificationsByType,
  updateReadStatus,
};
