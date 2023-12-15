import validator from 'validator';
import { notificationMap } from '../utils/common.js';

const isEmpty = value => {
  return value ? validator.isEmpty(value, { ignore_whitespace: true }) : true;
};

const list = {
  params: {
    id: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
  },
  query: {
    type: value => {
      const values = notificationMap.values;
      if (Array.isArray(value)) {
        const isLegal = value.every(item => values.includes(Number(item)));
        if (!isLegal) return '非法的消息类型';
      } else {
        if (isEmpty(value)) return '消息类型不能为空';
        if (!values.includes(Number(value))) return '非法的消息类型';
      }
    },
  },
};

const read = {
  body: {
    messages: value => {
      if (!Array.isArray(value)) return '消息ID列表类型错误';
    },
  },
};

export default { list, read };
