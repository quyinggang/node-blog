import { cacheUploadFileIntoSet } from '../utils/redis.js';
import NotificationProxy from '../notifications/proxy.js';
import MessageProxy from '../messages/proxy.js';

const uploadFile = async ctx => {
  const file = ctx.request.files.file;
  const fileName = file.newFilename;
  await cacheUploadFileIntoSet(fileName);
  ctx.body = fileName;
};

const getUnreadCount = async ctx => {
  const uid = ctx.query.uid;
  const [messageResult, notificationResult] = await Promise.all([
    MessageProxy.getUnreadCountByUserId(uid),
    NotificationProxy.getUnreadCountByUserId(uid),
  ]);
  ctx.body = {
    total: notificationResult.total + messageResult.total,
    record: {
      ...messageResult.record,
      ...notificationResult.record,
    },
  };
};

export default { uploadFile, getUnreadCount };
