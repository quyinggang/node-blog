import request from '@/config/request';

const prefix = '/comments';

export const createComment = data =>
  request({ prefix, method: 'post', url: '/new', data });

export const getComments = params =>
  request({ prefix, method: 'get', url: '/public/list', params });

export const getCommentCount = params =>
  request({ prefix, method: 'get', url: '/public/count', params });
