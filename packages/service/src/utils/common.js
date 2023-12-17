import crypto from 'node:crypto';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.js';

export const successHttpBody = { code: 20000, message: 'success', data: true };

export const getStaticResourceUrl = value => `/static/${value}`;

// 类型校验相关
const toString = Object.prototype.toString;
export const isObject = value => {
  return toString.call(value) === '[object Object]';
};
export const isFunction = value => {
  return typeof value === 'function';
};

// token相关
export const signToken = (payload, expiresIn) => {
  return jsonwebtoken.sign(payload, config.token.secret, {
    expiresIn,
  });
};
export const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, config.token.secret, (error, decoded) => {
      error ? reject(error) : resolve(decoded);
    });
  });
};
export const getTokenFromRequestHeader = header => {
  if (!header || !header.authorization) {
    return;
  }

  const parts = header.authorization.trim().split(' ');
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
};

export const hmacHash = value => {
  return crypto
    .createHmac('sha256', config.hashSalt)
    .update(value)
    .digest('hex');
};

const getValueMap = map => {
  const valueMap = {};
  for (const [key, value] of Object.entries(map)) {
    valueMap[value] = key;
  }
  return valueMap;
};
const notificationAlias = {
  comment: 0,
  reply: 1,
  follow: 2,
};
export const notificationMap = {
  alias: notificationAlias,
  valueMap: getValueMap(notificationAlias),
  keys: Object.keys(notificationAlias),
  values: Object.values(notificationAlias),
};

export const socketTypeAlias = {
  response: {
    connected: 0,
    message: 1,
  },
  request: {
    message: -1,
    auth: 0,
    connection: 1,
    chat: 2,
  },
};

export const validateWebSocketMessage = message => {
  if (!message) return false;
  const isLegalType = Object.values(socketTypeAlias.request).includes(
    message.type
  );
  const isLegalValue = Object.keys(message.value).length > 0;
  return isLegalType && isLegalValue;
};

export const getSocketClientKey = data => {
  const { url, uid } = data;
  return `${url}@${uid}`;
};
