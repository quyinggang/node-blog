export default () => {
  const middleware = async (ctx, next) => {
    await next();

    const url = ctx.url;
    const status = ctx.status;
    const method = ctx.method.toLowerCase();
    // 只处理非预检请求的HTTP接口不包含
    if (url.indexOf('/api/') > -1 && method !== 'options' && status !== 404) {
      ctx.body = { code: 20000, message: 'success', data: ctx.body || true };
    }
  };
  return middleware;
};
