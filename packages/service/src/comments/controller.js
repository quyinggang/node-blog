import service from './service.js';

const getComments = async ctx => {
  const data = await service.getCommentsByTopicId(ctx.query);
  ctx.body = data;
};

const getCommentCount = async ctx => {
  const data = await service.getCommentCountByTopicId(ctx.query);
  ctx.body = data;
};

const createComment = async ctx => {
  await service.createComment(ctx.request.body);
};

const deleteComment = async ctx => {
  await service.deleteCommentById(ctx.params.id);
};

export default { getComments, getCommentCount, createComment, deleteComment };
