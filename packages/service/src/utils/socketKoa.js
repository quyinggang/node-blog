import { WebSocketServer } from 'ws';
import compose from 'koa-compose';
import logger from '../config/logger.js';
import {
  verifyToken,
  socketTypeAlias,
  validateWebSocketMessage,
  getSocketClientKey,
} from './common.js';

const onError = err => logger.error(err.stack || err.toString() || err);

class SocketConnectionPool {
  constructor() {
    this.clients = new Map();
  }

  add(key, value) {
    this.clients.set(key, value);
  }

  remove(key) {
    this.clients.delete(key);
  }
}

class KoaWebSocket {
  constructor() {
    this.app = null;
    this.middleware = [];
    this.clientMap = new SocketConnectionPool();
  }

  proxy(app) {
    this.app = app;
    return app;
  }

  listen(server) {
    const { app, middleware, clientMap } = this;
    if (!app) {
      logger.error('need proxy koa instance');
      return;
    }

    const wss = new WebSocketServer({ noServer: true, clientTracking: false });
    wss.on('connection', (socket, req) => {
      let clientKey = null;
      const url = req.url;
      socket.on('error', onError);
      socket.on('close', () => clientKey && clientMap.remove(clientKey));
      const authPromise = new Promise((resolve, reject) => {
        socket.on('message', async message => {
          // 连接成功后需要进行权限校验，此处逻辑应该在握手阶段处理，但是通过子协议传递token会导致报错
          try {
            const data = JSON.parse(message);
            if (!validateWebSocketMessage(data)) {
              throw new Error('非法的WebSocket业务信息格式');
            }
            const isAuthMessage = data.type === socketTypeAlias.request.auth;
            if (isAuthMessage) {
              const { uid } = await verifyToken(data.value);
              if (!uid) {
                throw new Error('WebSocket业务鉴权失败');
              }
              clientKey = getSocketClientKey({ url, uid });
              clientMap.add(clientKey, socket);
              socket.send(
                JSON.stringify({
                  type: socketTypeAlias.response.connected,
                  value: 'connected',
                })
              );
            }
            resolve(isAuthMessage);
          } catch (e) {
            reject(e);
          }
        });
      });
      authPromise.then(isAuth => {
        if (!isAuth) return;
        const fnMiddleware = compose(middleware);
        const ctx = app.createContext(req, {});
        ctx.webSocket = socket;
        // 权限校验过后再处理各路由逻辑
        fnMiddleware(ctx).catch(onError);
      });
    });

    const upgradeSuccessCallback = (request, socket, head) => {
      socket.removeListener('error', onError);

      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    };
    server.on('upgrade', async (request, socket, head) => {
      socket.on('error', onError);
      // 用户握手连接处理阶段可自定义权限校验
      upgradeSuccessCallback(request, socket, head);
    });
  }

  use(fn) {
    this.middleware.push(fn);
    return this;
  }
}

export default new KoaWebSocket();
