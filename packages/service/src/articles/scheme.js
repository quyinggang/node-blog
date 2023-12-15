import validator from 'validator';

const isEmpty = value => {
  return value ? validator.isEmpty(value, { ignore_whitespace: true }) : true;
};

const article = {
  params: {
    id: value => {
      if (isEmpty(value)) return '文章ID不能为空';
      if (!validator.isMongoId(value)) return '文章ID非法';
    },
  },
};

const drafts = {
  query: {
    uid: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
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

const list = {
  query: {
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

const publish = {
  body: {
    title: value => {
      if (isEmpty(value)) return '文章标题不能为空';
    },
    description: value => {
      if (isEmpty(value)) return '文章摘要不能为空';
    },
    content: value => {
      if (isEmpty(value)) return '文章内容不能为空';
    },
    uid: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
  },
};

const updateArticle = {
  params: {
    id: value => {
      if (isEmpty(value)) return '文章ID不能为空';
      if (!validator.isMongoId(value)) return '非法的文章ID';
    },
  },
  body: {
    title: value => {
      if (isEmpty(value)) return '文章标题不能为空';
    },
    description: value => {
      if (isEmpty(value)) return '文章摘要不能为空';
    },
    content: value => {
      if (isEmpty(value)) return '文章内容不能为空';
    },
  },
};

const userArticle = {
  params: {
    id: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
  },
  query: {
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

const readArticle = {
  params: {
    id: value => {
      if (isEmpty(value)) return '文章ID不能为空';
      if (!validator.isMongoId(value)) return '非法的文章ID';
    },
  },
};

export default {
  article,
  list,
  publish,
  drafts,
  updateArticle,
  userArticle,
  readArticle,
};
