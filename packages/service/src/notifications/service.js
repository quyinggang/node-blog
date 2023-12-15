import model from './model.js';

const getNotificationsByType = async data => {
  const { uid, type, page, size } = data;
  const types = Array.isArray(type) ? type : [type];
  const total = await model
    .find({
      $and: [{ receiver: uid }, { type: { $in: types } }],
    })
    .count()
    .exec();
  const list = await model
    .find({
      $and: [{ receiver: uid }, { type: { $in: types } }],
    })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ create_at: -1 })
    .populate('sender', 'name')
    .exec();
  return { total, list };
};

const updateReadStatus = async data => {
  const { messages } = data;
  if (!Array.isArray(messages) || messages.length === 0) return;
  const updates = messages.map(id => {
    return { updateOne: { filter: { _id: id }, update: { has_read: true } } };
  });
  return model.bulkWrite(updates);
};

export default {
  getNotificationsByType,
  updateReadStatus,
};
