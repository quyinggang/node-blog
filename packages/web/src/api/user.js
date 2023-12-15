import request from '@/config/request';

const prefix = '/users';
// 登录接口
export const login = (data) =>
  request({ prefix, method: 'post', url: '/public/login', data });

// 退出登陆
export const logout = () =>
  request({ prefix, method: 'delete', url: '/logout' });

// 依据token获取用户基本信息
export const getUserBaseInfo = () =>
  request({ prefix, method: 'get', url: '/info' });

// 依据用户ID获取用户所有信息
export const getUserAllInfo = (id) =>
  request({ prefix, method: 'get', url: `/public/${id}` });

// 关注
export const followUser = (data) =>
  request({ prefix, method: 'post', url: '/public/follow', data });

// 取消关注
export const cancelFollowUser = (data) =>
  request({ prefix, method: 'put', url: '/relation/cancel', data });

// 获取用户是否是粉丝关系
export const getUserFollowRelation = (params) =>
  request({ prefix, method: 'get', url: '/relation', params });

// 获取粉丝列表
export const getFollowerList = (params) =>
  request({ prefix, method: 'get', url: '/public/follower', params });

// 获取关注列表
export const getFollowingList = (params) =>
  request({ prefix, method: 'get', url: '/public/following', params });

// 刷新token
export const refreshAccessToken = (data) =>
  request({ prefix, method: 'post', url: '/public/refresh', data });

// 更新用户个人信息
export const updateProfile = (data) =>
  request({ prefix, method: 'put', url: '/profile', data });

// 重置密码
export const resetPassword = (data) =>
  request({ prefix, method: 'put', url: '/password', data });

// 注销账户
export const cancelAccount = (uid) =>
  request({ prefix, method: 'delete', url: `/${uid}` });
