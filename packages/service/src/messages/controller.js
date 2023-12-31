import service from './service.js';

const updateMessageReadStatus = async ctx => {
  await service.updateReadStatusByUserId(ctx.request.body);
  ctx.body = true;
};

const getMessages = async ctx => {
  const data = await service.getMessagesByUserId(ctx.query);
  ctx.body = data;
};

const deleteMessages = async ctx => {
  await service.deleteMessagesByUserId(ctx.request.body);
  ctx.body = true;
};

const getMessagesCount = async ctx => {
  const data = await service.getMessagesCountByUserId(ctx.query);
  ctx.body = data;
};

export default {
  updateMessageReadStatus,
  getMessages,
  deleteMessages,
  getMessagesCount,
};
