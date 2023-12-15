import xss from 'xss';
import model from './model.js';
import { BusinessError } from '../utils/errors.js';

const getArticleById = async id => {
  const query = await model.findById(id).populate('author', 'name').exec();
  if (!query) {
    throw new BusinessError('文章不存在');
  }
  return query;
};

const getArticleList = async params => {
  const { page, size } = params;
  return model
    .find({ status: 1 })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ create_at: -1 })
    .populate('author', 'name')
    .exec();
};

const getArticlesByAuthorId = async (uid, data) => {
  const { page, size } = data;
  return model
    .find({ author: uid, status: 1 })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ create_at: -1 })
    .populate('author', 'name')
    .exec();
};

const getDraftsByAuthorId = async params => {
  const { page, size, uid } = params;
  const total = await model.find({ author: uid, status: 0 }).count().exec();
  const list = await model
    .find({ author: uid, status: 0 })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ create_at: -1 })
    .exec();
  return { total, list };
};

const createArticle = async data => {
  const { title, description, content, uid } = data;
  return model.create({
    title: xss(title),
    description: xss(description),
    content,
    author: uid,
    status: 1,
  });
};

const createDraft = async data => {
  const { title, description, content, uid } = data;
  return model.create({
    title: xss(title),
    description: xss(description),
    content,
    author: uid,
  });
};

const deleteArticleById = async id => {
  return model.findByIdAndDelete(id).exec();
};

const updateArticleContent = async (id, data) => {
  const { title, description, content } = data;
  return model
    .findByIdAndUpdate(id, {
      title: xss(title),
      description: xss(description),
      content,
    })
    .exec();
};

const updateArticleCount = async id => {
  const query = await model.findById(id).exec();
  await model
    .findByIdAndUpdate(id, {
      read_count: query.read_count + 1,
    })
    .exec();
  return query.read_count + 1;
};

export default {
  getArticleById,
  getArticleList,
  getArticlesByAuthorId,
  getDraftsByAuthorId,
  createArticle,
  createDraft,
  deleteArticleById,
  updateArticleContent,
  updateArticleCount,
};
