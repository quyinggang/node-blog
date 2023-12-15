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

const notificationAlias = {
  comment: 0,
  reply: 1,
  follow: 2,
};
const getValueMap = () => {
  const valueMap = {};
  for (const [key, value] of Object.entries(notificationAlias)) {
    valueMap[value] = key;
  }
  return valueMap;
};
const valueMap = getValueMap();
export const notificationMap = {
  alias: notificationAlias,
  valueMap,
  keys: Object.keys(notificationAlias),
  values: Object.values(notificationAlias),
};
