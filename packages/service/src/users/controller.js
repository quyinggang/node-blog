import service from './service.js';
import { getTokenFromRequestHeader, verifyToken } from '../utils/common.js';
import { cacheUploadFileIntoSet } from '../utils/redis.js';

const uploadAvatarFile = async ctx => {
  const file = ctx.request.files.file;
  const fileName = file.newFilename;
  await cacheUploadFileIntoSet(fileName);
  ctx.body = fileName;
};

const login = async ctx => {
  const { accessToken, refreshToken, user } = await service.login(
    ctx.request.body
  );
  ctx.body = {
    accessToken,
    refreshToken,
    user,
  };
};

const getBasicInfoByToken = async ctx => {
  const accessToken = getTokenFromRequestHeader(ctx.header);
  const result = await verifyToken(accessToken);
  const user = await service.getUserBasicInfo(result.uid);
  ctx.body = user;
};

const getUserAllInfo = async ctx => {
  const user = await service.getUserAllInfo(ctx.params.id);
  ctx.body = user;
};

const logout = async ctx => {
  await service.logout(ctx.header);
  ctx.body = true;
};

const follow = async ctx => {
  await service.follow(ctx.request.body);
  ctx.body = true;
};

const cancelFollow = async ctx => {
  await service.cancelFollow(ctx.request.body);
  ctx.body = true;
};

const refreshToken = async ctx => {
  const result = await service.getNewLoginToken({
    header: ctx.header,
    body: ctx.request.body,
  });
  ctx.body = result;
};

const updateProfile = async ctx => {
  const user = await service.updateProfile(ctx.request.body);
  ctx.body = user;
};

const updatePassword = async ctx => {
  await service.updatePassword(ctx.request.body);
  ctx.body = true;
};

const revokedAccount = async ctx => {
  await service.cancelAccount({ uid: ctx.params.id, header: ctx.header });
  ctx.body = true;
};

const getUserRelation = async ctx => {
  const params = {
    uid: ctx.query.uid,
    followUserId: ctx.query.targetId,
  };
  const data = await service.getFollowedRelation(params);
  ctx.body = data;
};

const getFollowerList = async ctx => {
  const data = await service.getFollowerList(ctx.query);
  ctx.body = data;
};

const getFollowingList = async ctx => {
  const data = await service.getFollowingList(ctx.query);
  ctx.body = data;
};

export default {
  login,
  logout,
  follow,
  cancelFollow,
  getUserAllInfo,
  getUserRelation,
  getBasicInfoByToken,
  getFollowerList,
  getFollowingList,
  refreshToken,
  updateProfile,
  updatePassword,
  revokedAccount,
  uploadAvatarFile,
};
