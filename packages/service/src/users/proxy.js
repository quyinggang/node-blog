import model from './model.js';
import { BusinessError } from '../utils/errors.js';

const getUserById = async id => {
  const user = await model.findById(id).exec();
  if (!user) {
    throw new BusinessError('用户不存在');
  }
  return user;
};

export default { getUserById };
