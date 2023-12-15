import model from './model.js';

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
    const { value: data } = JSON.parse(message.toString());
    console.log(data);
    // 保存信息到数据库
    // 查找对应的用户的socket连接是否存在，存在的话就直接发送消息
  });
};
const getMessageUserListByWebSocket = async ctx => {
  const webSocket = ctx.webSocket;
  webSocket.send('hello WebSocket Client');
  // 查询数据库用户信息以及统计未读信息个数
};

export default {
  getUnreadCountByUserId,
  chatByWebSocket,
  getMessageUserListByWebSocket,
};
