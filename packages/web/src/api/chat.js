import request from '@/config/request';

const prefix = '/messages';

// 获取信息
export const getChatMessagesList = params =>
  request({ prefix, method: 'get', url: `/record`, params });

// 已读信息
export const updateChatReadStatus = data =>
  request({ prefix, method: 'put', url: '/read', data });

// 删除通信双方所有聊天信息
export const deleteChatMessages = data =>
  request({ prefix, method: 'post', url: '/delete', data });

// WebSocket
const wsPrefix = `${import.meta.env.VITE_WS_API_URL}/ws`;
export const chatWebSocketUrl = `${wsPrefix}/chat`;
export const userWebSocketUrl = `${wsPrefix}/users`;
