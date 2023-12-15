import validator from 'validator';

const isEmpty = value => {
  return value ? validator.isEmpty(value, { ignore_whitespace: true }) : true;
};

const isXSS = value => {
  const newValue = String(value).toLowerCase();
  return (
    newValue.indexOf('javascript:') !== -1 ||
    validator.escape(newValue) !== newValue
  );
};

const login = {
  body: {
    email: value => {
      if (isEmpty(value)) return '邮箱不能为空';
      if (!validator.isEmail(value)) return '非法的邮箱地址';
    },
    password: value => {
      if (isEmpty(value)) return '密码不能为空';
      if (String(value).length < 4) return '密码至少4位';
    },
  },
};

const user = {
  params: {
    id: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
  },
};

const refresh = {
  body: {
    token: value => {
      if (isEmpty(value)) return '用户凭证不能为空';
      if (!validator.isJWT(value)) return '非法的用户凭证';
    },
  },
};

const profile = {
  body: {
    uid: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
    name: value => {
      if (isEmpty(value)) return '用户名不能为空';
      if (String(value).length > 20) return '用户名不能超过20个字符';
      if (isXSS(value)) return '用户名存在非法字符';
    },
  },
};

const updatePassword = {
  body: {
    uid: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
    password: value => {
      if (isEmpty(value)) return '密码不能为空';
      if (String(value).length < 4) return '密码至少4位';
    },
  },
};

const revokedAccount = {
  params: {
    id: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
  },
};

const follow = {
  body: {
    uid: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
    followUserId: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
  },
};

const relation = {
  query: {
    uid: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
    targetId: value => {
      if (isEmpty(value)) return '用户ID不能为空';
      if (!validator.isMongoId(value)) return '非法的用户ID';
    },
  },
};

const followList = {
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

export default {
  login,
  user,
  follow,
  refresh,
  profile,
  relation,
  followList,
  updatePassword,
  revokedAccount,
};
