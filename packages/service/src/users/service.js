import model from './model.js';
import ArticleProxy from '../articles/proxy.js';
import NotificationProxy from '../notifications/proxy.js';
import {
  setRedisKeyWithExpireTime,
  checkRedisKeyExistStatus,
  removeUploadFileFromSet,
  clearAllUploadCache,
} from '../utils/redis.js';
import {
  hmacHash,
  signToken,
  verifyToken,
  getStaticResourceUrl,
  getTokenFromRequestHeader,
} from '../utils/common.js';
import config from '../config/config.js';
import { BusinessError } from '../utils/errors.js';
import logger from '../config/logger.js';

const createNewToken = userId => {
  const accessToken = signToken(
    { uid: userId, createTime: Date.now() },
    config.token.accessTokenExpire
  );
  const refreshToken = signToken(
    { uid: userId, createTime: Date.now() },
    config.token.refreshTokenExpire
  );
  return {
    accessToken,
    refreshToken,
  };
};
const setExpireRedisTokenKey = async token => {
  const result = await verifyToken(token);
  const expireSecond = result.exp - result.iat;
  const duration = Date.now() - result.createTime;
  const remainMillisecond = expireSecond * 1000 - duration;
  if (remainMillisecond <= 0) return;
  // 黑名单机制：将token存储在redis中并设置对应的过期时间，重新登录需要校验token是否在黑名单中
  return setRedisKeyWithExpireTime(token, 1, remainMillisecond);
};

const login = async data => {
  const { email, password } = data;
  let query = await model.findOne({ email }).exec();
  if (!query) {
    const result = String(email).split('@');
    const data = await model.create({
      name: result[0],
      email,
      avatar: getStaticResourceUrl('default.awebp'),
      password: hmacHash(password),
    });
    query = data;
  } else {
    if (hmacHash(password) !== query.password) {
      throw new BusinessError('密码错误');
    }
  }
  const userId = query._id.toString();
  const tokens = createNewToken(userId);
  return {
    ...tokens,
    user: { uid: userId, name: query.name, avatar: query.avatar },
  };
};

const logout = async header => {
  const token = getTokenFromRequestHeader(header);
  await clearAllUploadCache();
  return setExpireRedisTokenKey(token);
};

const follow = async data => {
  const { uid, followUserId } = data;
  if (uid === followUserId) {
    throw new BusinessError('不能关注自己');
  }
  // 替换成bulkWrite
  await Promise.all([
    model
      .findByIdAndUpdate(uid, {
        $push: { following: followUserId },
      })
      .exec(),
    model
      .findByIdAndUpdate(followUserId, {
        $push: { follower: uid },
      })
      .exec(),
  ]);
  NotificationProxy.createFollowNotification({
    sender: uid,
    receiver: followUserId,
  });
};

const cancelFollow = async data => {
  const { uid, followUserId } = data;
  await Promise.all([
    model
      .findByIdAndUpdate(uid, {
        $pull: { following: followUserId },
      })
      .exec(),
    model
      .findByIdAndUpdate(followUserId, {
        $pull: { follower: uid },
      })
      .exec(),
  ]);
};

const getFollowedRelation = async data => {
  const { uid, followUserId } = data;
  const query = await model.findById(uid).exec();
  if (!query) {
    throw new BusinessError('用户不存在');
  }
  const following = query.following;
  return Array.isArray(following) && following.includes(followUserId);
};

const getFollowerList = async data => {
  const { uid, page, size } = data;
  const query = await model.findById(uid).exec();
  if (!query) {
    throw new BusinessError('用户不存在');
  }
  const start = (page - 1) * size;
  const end = start + size;
  const list = query.follower.slice(start, end);
  return Promise.all(
    list.map(async id => {
      const result = await model.findById(id).exec();
      return { _id: result._id.toString(), name: result.name };
    })
  );
};

const getFollowingList = async data => {
  const { uid, page, size } = data;
  const query = await model.findById(uid).exec();
  if (!query) {
    throw new BusinessError('用户不存在');
  }
  const start = (page - 1) * size;
  const end = start + size;
  const list = query.following.slice(start, end);
  return Promise.all(
    list.map(async id => {
      const result = await model.findById(id).exec();
      return { _id: result._id.toString(), name: result.name };
    })
  );
};

const getUserBasicInfo = async uid => {
  const query = await model.findById(uid).exec();
  if (!query) {
    throw new BusinessError('用户不存在');
  }
  return {
    uid: query._id.toString(),
    name: query.name,
    avatar: query.avatar,
  };
};

const getUserAllInfo = async uid => {
  const query = await model.findById(uid).exec();
  if (!query) {
    throw new BusinessError('用户不存在');
  }
  const articleResult = await ArticleProxy.getArticleCountById(uid);

  return {
    uid: query._id.toString(),
    avatar: query.avatar,
    name: query.name,
    followerCount: query.follower.length,
    followingCount: query.following.length,
    readCount: articleResult.readSum,
    articleCount: articleResult.total,
  };
};

const getNewLoginToken = async data => {
  const { header, body } = data;
  const refreshToken = body.token;
  const accessToken = getTokenFromRequestHeader(header);
  const isAccessExist = await checkRedisKeyExistStatus(accessToken);
  const isRefreshExist = await checkRedisKeyExistStatus(refreshToken);
  if (isRefreshExist) {
    throw new BusinessError('Token invalid');
  }
  try {
    if (!isAccessExist) {
      await setExpireRedisTokenKey(accessToken);
    }
  } catch (e) {
    logger.info('Refresh API：', e);
  }
  await setExpireRedisTokenKey(refreshToken);
  const result = await verifyToken(refreshToken);
  const userId = result.uid;
  return createNewToken(userId);
};

const updateProfile = async data => {
  const { name, avatar, uid } = data;
  const avatarUrl = getStaticResourceUrl(avatar);
  await removeUploadFileFromSet(avatar);
  const updateAvatarConfig = avatar ? { avatar: avatarUrl } : {};
  await model
    .findByIdAndUpdate(uid, {
      name,
      ...updateAvatarConfig,
    })
    .exec();
  return avatar ? { name, avatar: avatarUrl } : { name };
};

const updatePassword = async data => {
  const { password, uid } = data;
  return model
    .findByIdAndUpdate(uid, {
      password: hmacHash(password),
    })
    .exec();
};

const cancelAccount = async data => {
  const { uid, header } = data;
  const token = getTokenFromRequestHeader(header);
  await clearAllUploadCache();
  await setExpireRedisTokenKey(token);
  return model.findByIdAndDelete(uid).exec();
};

export default {
  login,
  logout,
  follow,
  cancelFollow,
  getFollowerList,
  getFollowingList,
  getFollowedRelation,
  getUserBasicInfo,
  getUserAllInfo,
  getNewLoginToken,
  updateProfile,
  updatePassword,
  cancelAccount,
};
