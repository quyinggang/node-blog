import model from './model.js';

const updateReadStatus = async data => {
  const { messages } = data;
  if (!Array.isArray(messages) || messages.length === 0) return;
  const updates = messages.map(id => {
    return { updateOne: { filter: { _id: id }, update: { has_read: true } } };
  });
  return model.bulkWrite(updates);
};

export default {
  updateReadStatus,
};
