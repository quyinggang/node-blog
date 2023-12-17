import model from './model.js';
import { socketTypeAlias } from '../utils/common.js';

const updateReadStatusByUserId = async data => {
  const { sender, receiver } = data;
  const messages = await model
    .find({
      $and: [
        {
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        },
      ],
    })
    .exec();
  const updates = messages.map(id => {
    return { updateOne: { filter: { _id: id }, update: { has_read: true } } };
  });
  return model.bulkWrite(updates);
};

const getMessagesByUserId = async data => {
  const { sender, receiver, page, size } = data;
  const list = await model
    .find({
      $and: [
        { type: socketTypeAlias.request.chat },
        {
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        },
      ],
    })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ create_at: 1 })
    .exec();
  return { list };
};

const deleteMessagesByUserId = async data => {
  const { sender, receiver } = data;
  const messages = await model
    .find({
      $and: [
        {
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        },
      ],
    })
    .exec();
  const deleteList = messages.map(item => {
    return { deleteOne: { filter: { _id: item._id } } };
  });
  return model.bulkWrite(deleteList);
};

export default {
  deleteMessagesByUserId,
  updateReadStatusByUserId,
  getMessagesByUserId,
};
