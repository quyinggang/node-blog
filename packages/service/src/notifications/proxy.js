import mongoose from 'mongoose';
import model from './model.js';
import { notificationMap } from '../utils/common.js';

const notificationAlias = notificationMap.alias;

const createCommentNotification = data => {
  return model.create({
    type: notificationAlias.comment,
    ...data,
  });
};

const createReplyNotification = data => {
  return model.create({
    type: notificationAlias.reply,
    ...data,
  });
};

const createFollowNotification = data => {
  return model.create({
    type: notificationAlias.follow,
    ...data,
  });
};

const getUnreadCountByUserId = async uid => {
  const result = await model
    .aggregate([
      {
        $match: { receiver: new mongoose.Types.ObjectId(uid), has_read: false },
      },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ])
    .exec();
  let sum = 0;
  const record = {};
  notificationMap.keys.forEach(key => (record[key] = 0));
  for (const item of result) {
    const { _id, count } = item;
    const key = notificationMap.valueMap[_id];
    sum += count;
    record[key] = count;
  }
  return { total: sum, record };
};

export default {
  createCommentNotification,
  createReplyNotification,
  createFollowNotification,
  getUnreadCountByUserId,
};
