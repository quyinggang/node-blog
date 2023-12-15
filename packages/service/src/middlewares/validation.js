import { isFunction, isObject } from '../utils/common.js';
import { BusinessError } from '../utils/errors.js';

// const rules = {
//   body: {
//     name: (value) => {
//       // 只要返回字符串值就表示校验错误
//       if (!value) return '用户名不存在'
//     }
//   },
//   params: {},
//   query: {}
// }
export default rules => {
  const defaultKeys = ['body', 'params', 'query'];
  const schemaConfig = isObject(rules) ? { ...rules } : {};
  return async (ctx, next) => {
    for (const [key, config] of Object.entries(schemaConfig)) {
      if (defaultKeys.includes(key)) {
        let errorMessage = null;
        const data = key === 'body' ? ctx.request.body : ctx[key];
        for (const [name, validator] of Object.entries(config)) {
          if (isFunction(validator)) {
            const result = validator(data[name]);
            if (typeof result === 'string') {
              errorMessage = result;
              break;
            }
          }
        }
        if (errorMessage !== null) {
          ctx.throw(400, new BusinessError(errorMessage));
        }
      }
    }
    return next();
  };
};
