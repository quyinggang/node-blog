import validator from 'validator';
import model from './model.js';
import socketKoa from '../utils/socketKoa.js';
import { BusinessError } from '../utils/errors.js';
import { getSocketClientKey, socketTypeAlias } from '../utils/common.js';

const changeStream = model.watch();

const getUnreadCountByUserId = async id => {
  const count = await model
    .find({
      $and: [
        { type: socketTypeAlias.request.chat },
        { receiver: id },
        { has_read: false },
      ],
    })
    .count()
    .exec();
  return { total: count, record: { chat: count } };
};

const validateSenderAndReceiver = ({ sender, receiver }) => {
  if (!(sender && receiver)) {
    throw new BusinessError('消息参数不全');
  }
  if (!validator.isMongoId(sender) || !validator.isMongoId(receiver)) {
    throw new BusinessError('非法的用户ID');
  }
  if (sender === receiver) {
    throw new BusinessError('不支持与自己进行聊天');
  }
};
const createChatMessage = async value => {
  const { sender, receiver, content } = value;
  validateSenderAndReceiver({ sender, receiver });
  if (!content) {
    throw new BusinessError('聊天内容不存在');
  }
  const query = await model.create({
    type: socketTypeAlias.request.chat,
    sender,
    receiver,
    content,
  });
  return query;
};

const chatByWebSocket = async ctx => {
  const url = ctx.url;
  const webSocket = ctx.webSocket;
  webSocket.on('message', async message => {
    const { type, value } = JSON.parse(message.toString());
    if (type !== socketTypeAlias.request.chat) return;
    await createChatMessage(value);
    const replyMessage = JSON.stringify({
      type: socketTypeAlias.response.message,
      value,
    });
    webSocket.send(replyMessage);

    console.log(value);
    // 查找对应的用户的socket连接是否存在，存在的话就直接发送消息
    const socketClientMap = socketKoa.getClientMap();
    const clientKey = getSocketClientKey({ url, uid: value.receiver });
    const targetClientSocket = socketClientMap.get(clientKey);
    console.log(clientKey);
    console.log(targetClientSocket);
    targetClientSocket && targetClientSocket.send(replyMessage);
  });
};

// 查询数据库用户信息以及统计未读信息个数
const getUserList = async uid => {
  const users = await model
    .find({
      $and: [
        { type: socketTypeAlias.request.connection },
        { $or: [{ sender: uid }, { receiver: uid }] },
      ],
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .transform(res => {
      if (!res) return res;
      return res.map(item => {
        const { _id, sender, receiver } = item;
        return {
          _id,
          user: sender._id.toString() === uid ? receiver : sender,
        };
      });
    })
    .sort({ create_at: -1 })
    .exec();

  const list = await Promise.all(
    users.map(async item => {
      const id = item.user._id;
      const count = await model
        .find({
          $and: [
            { type: socketTypeAlias.request.chat },
            { $or: [{ sender: id }, { receiver: id }] },
            { has_read: false },
          ],
        })
        .count()
        .exec();
      return { ...item.user.toJSON(), count };
    })
  );
  return list;
};

const sendUserListInfo = async (socket, userId) => {
  if (!userId || !validator.isMongoId(userId)) return;
  const list = await getUserList(userId);
  const replyMessage = {
    type: socketTypeAlias.response.message,
    value: list,
  };
  socket.send(JSON.stringify(replyMessage));
};
const responseUserConnection = async data => {
  const { type, value } = data;
  validateSenderAndReceiver(value);
  const { sender, receiver } = value;
  const query = await model
    .exists({ $and: [{ type }, { sender }, { receiver }] })
    .exec();
  if (query) return;
  await model.create({ type, sender, receiver });
};

const userConnectByWebSocket = async ctx => {
  const webSocket = ctx.webSocket;
  webSocket.on('message', async message => {
    const { type, value } = JSON.parse(message.toString());
    if (
      ![
        socketTypeAlias.request.connection,
        socketTypeAlias.request.message,
      ].includes(type)
    ) {
      return;
    }
    if (type === socketTypeAlias.request.connection) {
      await responseUserConnection({ type, value });
      sendUserListInfo(webSocket, value.sender);
    } else {
      sendUserListInfo(webSocket, value.sender);
    }
  });

  changeStream.on('change', changeData => {
    console.log(changeData);
  });
};

export default {
  getUnreadCountByUserId,
  chatByWebSocket,
  userConnectByWebSocket,
};
