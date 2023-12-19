import { onBeforeUnmount } from 'vue';
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

  // 可靠的通信机制需要建立重连机制，实际上就是重新创建
  const socket = createWebSocket(config.ws, config.onMessage);

  onBeforeUnmount(() => socket.close());

  return socket;
}
