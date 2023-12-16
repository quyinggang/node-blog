import service from './service.js';
import {
  getTokenFromRequestHeader,
  successHttpBody,
  verifyToken,
} from '../utils/common.js';

const login = async ctx => {
  const { accessToken, refreshToken, user } = await service.login(
    ctx.request.body
  );
  ctx.body = {
    ...successHttpBody,
    data: {
      accessToken,
      refreshToken,
      user,
    },
  };
};

const getBasicInfoByToken = async ctx => {
  const accessToken = getTokenFromRequestHeader(ctx.header);
  const result = await verifyToken(accessToken);
  const user = await service.getUserBasicInfo(result.uid);
  ctx.body = {
    ...successHttpBody,
    data: user,
  };
};

const getUserAllInfo = async ctx => {
  const user = await service.getUserAllInfo(ctx.params.id);
  ctx.body = {
    ...successHttpBody,
    data: user,
  };
};

const logout = async ctx => {
  await service.logout(ctx.header);
  ctx.body = { ...successHttpBody };
};

const follow = async ctx => {
  await service.follow(ctx.request.body);
  ctx.body = { ...successHttpBody };
};

const cancelFollow = async ctx => {
  await service.cancelFollow(ctx.request.body);
  ctx.body = { ...successHttpBody };
};

const refreshToken = async ctx => {
  const result = await service.getNewLoginToken({
    header: ctx.header,
    body: ctx.request.body,
  });
  ctx.body = { ...successHttpBody, data: result };
};

const updateProfile = async ctx => {
  const user = await service.updateProfile(ctx.request.body);
  ctx.body = { ...successHttpBody, data: user };
};

const updatePassword = async ctx => {
  await service.updatePassword(ctx.request.body);
  ctx.body = { ...successHttpBody };
};

const revokedAccount = async ctx => {
  await service.cancelAccount({ uid: ctx.params.id, header: ctx.header });
  ctx.body = { ...successHttpBody };
};

const getUserRelation = async ctx => {
  const params = {
    uid: ctx.query.uid,
    followUserId: ctx.query.targetId,
  };
  const data = await service.getFollowedRelation(params);
  ctx.body = { ...successHttpBody, data };
};

const getFollowerList = async ctx => {
  const data = await service.getFollowerList(ctx.query);
  ctx.body = { ...successHttpBody, data };
};

const getFollowingList = async ctx => {
  const data = await service.getFollowingList(ctx.query);
  ctx.body = { ...successHttpBody, data };
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
};
