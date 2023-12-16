export const socketTypeAlias = {
  response: {
    connected: 0,
    message: 1,
  },
  request: {
    message: -1,
    auth: 0,
    connection: 1,
    chat: 2,
  },
};

export const getCurrentTimeTitle = () => {
  const current = new Date();
  const hour = current.getHours();
  if (hour >= 1 && hour < 5) return '凌晨';
  if (hour >= 5 && hour < 6) return '清晨';
  if (hour >= 6 && hour < 8) return '早晨';
  if (hour >= 8 && hour < 11) return '上午';
  if (hour >= 11 && hour < 13) return '中午';
  if (hour >= 13 && hour < 18) return '下午';
  if (hour >= 18 && hour < 23) return '晚上';
  if (hour >= 23 || hour < 1) return '午夜';
};

export const checkHtmlElement = element => element instanceof HTMLElement;

export const jsonParse = data => {
  let result = null;
  try {
    result = JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return result;
};
