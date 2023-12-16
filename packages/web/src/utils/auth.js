const ACCESS_TOKEN_KEY = 'AUTH_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_KEY';

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const saveToken = value => {
  const { accessToken, refreshToken } = value;
  accessToken && localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  refreshToken && localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const deleteToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
