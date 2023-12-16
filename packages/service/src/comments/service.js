import xss from 'xss';
import model from './model.js';
import ArticleProxy from '../articles/proxy.js';
import NotificationProxy from '../notifications/proxy.js';
import { BusinessError } from '../utils/errors.js';

const getCommentReplyUser = async id => {
  const comment = await model.findById(id).exec();
  if (!comment) {
    throw new BusinessError('要回复的评论不存在');
  }
  return comment.user.toString();
};

const getCommentCountByTopicId = async query => {
  const { topicId } = query;
  return model.find({ 'topic.id': topicId }).count().exec();
};

const getCommentsByTopicId = async data => {
  const { topicId, page, size } = data;
  const list = await model
    .find({
      $and: [
        { 'topic.id': topicId },
        { root_comment_id: { $exists: false } },
        { parent_comment_id: { $exists: false } },
      ],
    })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ create_at: -1 })
    .populate('user', 'name avatar')
    .exec();
  const result = Promise.all(
    list.map(async item => {
      const query = await model
        .find({
          root_comment_id: item._id,
        })
        .populate('user', 'name avatar')
        .exec();
      const userMap = new Map();
      const replies = [];
      for (const comment of query) {
        const id = comment._id.toString();
        userMap.set(id, comment.user);
      }
      for (const comment of query) {
        const reply = { ...comment.toJSON() };
        const parent_comment_id = reply.parent_comment_id;
        if (parent_comment_id) {
          const parentId = parent_comment_id.toString();
          const targetUser = userMap.get(parentId);
          if (targetUser) {
            reply.replyUser = targetUser;
          }
        }
        replies.push(reply);
      }
      return Object.assign({}, item.toJSON(), { replies });
    })
  );
  return result;
};

const createComment = async data => {
  const { topicId, uid, content, rootId, parentId } = data;
  const article = await ArticleProxy.getArticleById(topicId);
  const isTopComment = !(rootId || parentId);
  const commentRecord = {
    'topic.id': topicId,
    user: uid,
    content: xss(content),
  };
  const callbacks = [];
  if (rootId) {
    const rootUserId = await getCommentReplyUser(rootId);
    commentRecord['root_comment_id'] = rootId;
    callbacks.push(() => {
      if (uid === rootUserId) return;
      NotificationProxy.createReplyNotification({
        sender: uid,
        receiver: rootUserId,
        content: commentRecord.content,
      });
    });
  }
  if (parentId) {
    const parentUserId = await getCommentReplyUser(parentId);
    commentRecord['parent_comment_id'] = parentId;
    callbacks.push(() => {
      // 自己给自己评论是否要创建到通知？
      if (uid === parentUserId) return;
      NotificationProxy.createReplyNotification({
        sender: uid,
        receiver: parentUserId,
        content: commentRecord.content,
      });
    });
  }
  const comment = await model.create(commentRecord);
  if (isTopComment && uid !== article.author.toString()) {
    NotificationProxy.createCommentNotification({
      sender: uid,
      receiver: article.author,
      content: commentRecord.content,
    });
  }
  callbacks.forEach(cb => typeof cb === 'function' && cb());
  return comment;
};

const deleteComment = async id => {
  return model.findByIdAndRemove(id).exec();
};

export default {
  getCommentCountByTopicId,
  getCommentsByTopicId,
  createComment,
  deleteComment,
};
