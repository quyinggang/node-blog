import request from '@/config/request';

const prefix = '/notifications';

// 获取信息
export const getNotificationList = (id, params) =>
  request({ prefix, method: 'get', url: `/${id}`, params });

// 已读信息
export const updateNotificationReadStatus = data =>
  request({ prefix, method: 'put', url: '/read', data });
