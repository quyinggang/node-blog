import validator from 'validator';
import model from './model.js';
import socketKoa from '../utils/socketKoa.js';
import { BusinessError } from '../utils/errors.js';
import { getSocketClientKey, socketTypeAlias } from '../utils/common.js';

/**
 * change stream需要mongodb数据库存在opLog，如果不存在需要配置复制集才能生效
 *
 * - 在mongodb配置文件mongo.conf配置，例如
 *    replication:
 *      replSetName: rs0   # yourReplicaSetName
 *      oplogSizeMB: 1024  # 设置为1GB，根据需要调整大小
 * - 重启mongodb服务后，使用mongo shell登录数据库，执行rs.initiate()命令初始化复制集，因为只有一个节点，这个节点会变成Primary
 * - 使用命令rs.printReplicationInfo()查看opLog状态
 */
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
    const result = await createChatMessage(value);
    const replyMessage = JSON.stringify({
      type: socketTypeAlias.response.message,
      value: result,
    });
    webSocket.send(replyMessage);

    // 查找对应的用户的socket连接是否存在，存在的话就直接发送消息
    const socketClientMap = socketKoa.getClientMap();
    const clientKey = getSocketClientKey({ url, uid: value.receiver });
    const targetClientSocket = socketClientMap.get(clientKey);
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

  changeStream.on('change', changeData => {
    if (changeData && changeData.operationType === 'insert') {
      const sender = changeData.fullDocument.sender.toString();
      sendUserListInfo(webSocket, sender);
    }
  });

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
};

export default {
  getUnreadCountByUserId,
  chatByWebSocket,
  userConnectByWebSocket,
};
