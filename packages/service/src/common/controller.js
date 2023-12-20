import NotificationProxy from '../notifications/proxy.js';
import MessageProxy from '../messages/proxy.js';
import { getStaticResourceUrl } from '../utils/common.js';

const uploadFile = async ctx => {
  const file = ctx.request.files.file;
  const files = Array.isArray(file) ? [...file] : [file];
  ctx.body = files.map(item => {
    if (!item) return;
    return {
      name: item.originalFilename,
      url: getStaticResourceUrl(item.newFilename),
    };
  });
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
