import model from './model.js';
import { BusinessError } from '../utils/errors.js';

const getArticleById = async topicId => {
  const query = await model.findById(topicId).exec();
  if (!query) {
    throw new BusinessError('文章不存在');
  }
  return query;
};

const getArticleCountById = async id => {
  const total = await model.find({ author: id }).count().exec();
  const query = await model.find({ author: id }).exec();

  let readSum = 0;
  for (const article of query) {
    readSum += article.read_count;
  }

  return { total, readSum };
};

export default { getArticleById, getArticleCountById };
