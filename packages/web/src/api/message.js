import request from '@/config/request';

const prefix = '/notifications';

// 获取信息
export const getMessageList = (id, params) =>
  request({ prefix, method: 'get', url: `/${id}`, params });

// 已读信息
export const updateMessageRead = data =>
  request({ prefix, method: 'put', url: '/read', data });

// Chat WebSocket
const wsUrl = import.meta.env.VITE_WS_API_URL;
export const chatWebSocketUrl = `${wsUrl}/ws/chat`;
export const userWebSocketUrl = `${wsUrl}/ws/users`;
