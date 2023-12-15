import axios from 'axios';

export default (config) => {
  const { prefix, url, ...other } = config;
  const realUrl = `${prefix}${url}`.trim();
  return axios({ ...other, url: realUrl }).catch(() => {
    return Promise.reject('axios error');
  });
};
