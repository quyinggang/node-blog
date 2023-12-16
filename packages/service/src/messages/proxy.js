import validator from 'validator';
import model from './model.js';
import { socketTypeAlias } from '../utils/common.js';

const getUnreadCountByUserId = async id => {
  const count = await model
    .find({ $and: [{ receiver: id }, { has_read: false }] })
    .count()
    .exec();
  return { total: count, record: { chat: count } };
};

const chatByWebSocket = async ctx => {
  const webSocket = ctx.webSocket;
  webSocket.on('message', message => {
    const { type, value } = JSON.parse(message.toString());
    if (type !== socketTypeAlias.request.chat) return;
    console.log(value);
    // 保存信息到数据库
    // 查找对应的用户的socket连接是否存在，存在的话就直接发送消息
  });
};
const userConnectByWebSocket = async ctx => {
  const webSocket = ctx.webSocket;

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
  const responseUserConnection = async data => {
    const { type, value } = data;
    if (type !== socketTypeAlias.request.connection) return;
    const { sender, receiver } = value;
    if (!(sender && receiver)) return;
    if (!validator.isMongoId(sender) || !validator.isMongoId(receiver)) return;
    const query = await model
      .exists({ $and: [{ type }, { sender }, { receiver }] })
      .exec();
    if (query) return;
    await model.create({ type, sender, receiver });
  };
  webSocket.on('message', async message => {
    const data = JSON.parse(message.toString());
    responseUserConnection(data);

    const list = await getUserList(data.value.sender);
    const replyMessage = {
      type: socketTypeAlias.response.message,
      value: list,
    };
    webSocket.send(JSON.stringify(replyMessage));
  });
};

export default {
  getUnreadCountByUserId,
  chatByWebSocket,
  userConnectByWebSocket,
};
