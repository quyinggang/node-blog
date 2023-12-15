import service from './service.js';
import { successHttpBody } from '../utils/common.js';

const getArticle = async ctx => {
  const data = await service.getArticleById(ctx.params.id);
  ctx.body = {
    ...successHttpBody,
    data,
  };
};

const getList = async ctx => {
  const data = await service.getArticleList(ctx.query);
  ctx.body = {
    ...successHttpBody,
    data,
  };
};

const getUserArticles = async ctx => {
  const data = await service.getArticlesByAuthorId(ctx.params.id, ctx.query);
  ctx.body = { ...successHttpBody, data };
};

const publish = async ctx => {
  await service.createArticle(ctx.request.body);
  ctx.body = {
    ...successHttpBody,
  };
};

const saveDraft = async ctx => {
  await service.createDraft(ctx.request.body);
  ctx.body = { ...successHttpBody };
};

const deleteArticle = async ctx => {
  await service.deleteArticleById(ctx.params.id);
  ctx.body = { ...successHttpBody };
};

const getDrafts = async ctx => {
  const data = await service.getDraftsByAuthorId(ctx.query);
  ctx.body = { ...successHttpBody, data };
};

const updateArticle = async ctx => {
  await service.updateArticleContent(ctx.params.id);
  ctx.body = { ...successHttpBody };
};

const readArticle = async ctx => {
  await service.updateArticleCount(ctx.params.id);
  ctx.body = { ...successHttpBody };
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
