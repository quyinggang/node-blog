import request from '@/config/request';

const prefix = '/common';

export const uploadFile = (data) =>
  request({
    prefix,
    method: 'post',
    url: '/upload',
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// 获取未读信息总数
export const getUnreadInformationCount = (params) =>
  request({ prefix, method: 'get', url: '/information/count', params });
