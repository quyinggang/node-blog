import request from '@/config/request';

const prefix = '/articles';

export const createArticle = data =>
  request({ prefix, method: 'post', url: '/new', data });

export const createDraft = data =>
  request({ prefix, method: 'post', url: '/draft', data });

export const getDrafts = params =>
  request({ prefix, method: 'get', url: '/drafts', params });

export const deleteArticle = id =>
  request({ prefix, method: 'delete', url: `/${id}` });

export const getArticle = id =>
  request({ prefix, method: 'get', url: `/public/${id}` });

export const updateArticle = (id, data) =>
  request({ prefix, method: 'put', url: `/${id}`, data });

export const getAllArticle = params =>
  request({ prefix, method: 'get', url: '/public/list', params });

export const getArticleOfTargetUser = (id, params) =>
  request({ prefix, method: 'get', url: `/public/user/${id}`, params });

export const updateArticleReadCount = id =>
  request({ prefix, method: 'put', url: `/public/read/${id}` });
