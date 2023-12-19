import service from './service.js';

const getArticle = async ctx => {
  const data = await service.getArticleById(ctx.params.id);
  ctx.body = data;
};

const getList = async ctx => {
  const data = await service.getArticleList(ctx.query);
  ctx.body = data;
};

const getUserArticles = async ctx => {
  const data = await service.getArticlesByAuthorId(ctx.params.id, ctx.query);
  ctx.body = data;
};

const publish = async ctx => {
  await service.createArticle(ctx.request.body);
  ctx.body = true;
};

const saveDraft = async ctx => {
  await service.createDraft(ctx.request.body);
  ctx.body = true;
};

const deleteArticle = async ctx => {
  await service.deleteArticleById(ctx.params.id);
  ctx.body = true;
};

const getDrafts = async ctx => {
  const data = await service.getDraftsByAuthorId(ctx.query);
  ctx.body = data;
};

const updateArticle = async ctx => {
  await service.updateArticleContent(ctx.params.id);
  ctx.body = true;
};

const readArticle = async ctx => {
  const data = await service.updateArticleCount(ctx.params.id);
  ctx.body = data;
};

export default {
  getArticle,
  publish,
  getList,
  getUserArticles,
  deleteArticle,
  saveDraft,
  getDrafts,
  updateArticle,
  readArticle,
};
