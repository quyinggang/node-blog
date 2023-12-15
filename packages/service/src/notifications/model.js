import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const NotificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  sender: { type: ObjectId, ref: 'User', required: true },
  receiver: { type: ObjectId, ref: 'User', required: true },
  content: { type: String },
  has_read: { type: Boolean, default: false },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

NotificationSchema.index({ type: 1 });
NotificationSchema.index({ create_at: -1 });

export default mongoose.model('Notification', NotificationSchema);
