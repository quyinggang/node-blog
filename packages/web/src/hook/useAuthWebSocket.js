import { getRefreshToken } from '@/utils/auth';
import { socketTypeAlias, jsonParse } from '@/utils/common';

export default function useAuthWebSocket(config) {
  const createWebSocket = (url, messageHandler) => {
    const socket = new WebSocket(url);
    socket.addEventListener('message', event => {
      const messageInfo = jsonParse(event.data);
      if (messageInfo && typeof messageHandler === 'function') {
        messageHandler(messageInfo);
      }
    });
    socket.addEventListener('open', () => {
      // 权限校验
      const message = JSON.stringify({
        type: socketTypeAlias.request.auth,
        value: getRefreshToken(),
      });
      socket.send(message);
    });
    return socket;
  };

  return createWebSocket(config.ws, config.onMessage);
}
