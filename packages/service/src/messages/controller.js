import service from './service.js';
import { successHttpBody } from '../utils/common.js';

const updateMessageReadStatus = async ctx => {
  await service.updateReadStatusByUserId(ctx.request.body);
  ctx.body = { ...successHttpBody };
};

const getMessages = async ctx => {
  const data = await service.getMessagesByUserId(ctx.query);
  ctx.body = { ...successHttpBody, data };
};

const deleteMessages = async ctx => {
  await service.deleteMessagesByUserId(ctx.request.body);
  ctx.body = { ...successHttpBody };
};

const getMessagesCount = async ctx => {
  const data = await service.getMessagesCountByUserId(ctx.query);
  ctx.body = { ...successHttpBody, data };
};

export default {
  updateMessageReadStatus,
  getMessages,
  deleteMessages,
  getMessagesCount,
};
