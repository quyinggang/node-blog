import axios from 'axios';
import qs from 'qs';
import { getAccessToken } from '@/utils/auth';
import { Message, Modal } from '@arco-design/web-vue';
import { deleteToken, getRefreshToken } from '@/utils/auth';
import { refreshAccessToken } from '@/api/user';
import { saveToken } from '../utils/auth';

let isRefreshing = false;
const retryQueue = [];

const showReLoginModal = () => {
  Modal.error({
    title: '重要提示',
    content: '用户的当前登录凭证非法或者失效，请重新登录！',
    bodyStyle: 'text-align:center',
    okText: '重新登录',
    onOk: () => {
      deleteToken();
      location.href = '/';
    },
  });
};
const handleTokenError = async (config, errorMsg) => {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const res = await refreshAccessToken({ token: refreshToken });
        saveToken(res);
        retryQueue.splice(0).forEach(cb => cb());
        // 阻塞触发refresh的请求直至再次请求
        return axios(config);
      } catch (e) {
        retryQueue.splice(0);
        showReLoginModal();
      } finally {
        isRefreshing = false;
      }
    } else {
      // 缓存并阻塞refresh期间的请求
      return new Promise(resolve => {
        retryQueue.push(() => resolve(axios(config)));
      });
    }
  } else {
    showReLoginModal();
  }
  return Promise.reject(new Error(errorMsg || 'Error'));
};

axios.defaults.baseURL = `${import.meta.env.VITE_HTTP_API_URL}/api`;

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
};

axios.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    const { code, message, data } = response.data;
    if (code !== 20000) {
      if (code === 50000) {
        return handleTokenError(response.config, message);
      }
      Message.error({ content: message || 'Error', duration: 5 * 1000 });
      return Promise.reject(new Error(message || 'Error'));
    }
    return data;
  },
  error => {
    Message.error({
      content: error.message || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
