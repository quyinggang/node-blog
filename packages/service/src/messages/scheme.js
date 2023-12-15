import validator from 'validator';

const isEmpty = value => {
  return value ? validator.isEmpty(value, { ignore_whitespace: true }) : true;
};

const count = {
  query: {
    uid: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
  },
};

const list = {
  query: {
    topicId: value => {
      if (isEmpty(value)) return '文章ID不能为空';
      if (!validator.isMongoId(value)) return '非法的文章ID';
    },
    page: value => {
      if (isEmpty(value)) return '页数不能为空';
      const page = Number(value);
      if (!Number.isInteger(page) || page <= 0 || !Number.isSafeInteger(page)) {
        return '页数参数非法';
      }
    },
    size: value => {
      if (isEmpty(value)) return '每页数量不能为空';
      const size = Number(value);
      if (!Number.isInteger(size) || size <= 0 || !Number.isSafeInteger(size)) {
        return '每页数量参数非法';
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

export default { count, list, read };
