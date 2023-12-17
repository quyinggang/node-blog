import service from './service.js';
import { successHttpBody } from '../utils/common.js';

const updateReadStatus = async ctx => {
  await service.updateReadStatus(ctx.request.body);
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

export default { updateReadStatus, getMessages, deleteMessages };
