import service from './service.js';
import { successHttpBody } from '../utils/common.js';

const getComments = async ctx => {
  const data = await service.getCommentsByTopicId(ctx.query);
  ctx.body = { ...successHttpBody, data };
};

const getCommentCount = async ctx => {
  const data = await service.getCommentCountByTopicId(ctx.query);
  ctx.body = { ...successHttpBody, data };
};

const createComment = async ctx => {
  await service.createComment(ctx.request.body);
  ctx.body = { ...successHttpBody };
};

const deleteComment = async ctx => {
  await service.deleteCommentById(ctx.params.id);
  ctx.body = { ...successHttpBody };
};

export default { getComments, getCommentCount, createComment, deleteComment };
