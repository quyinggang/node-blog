import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = new mongoose.Schema({
  event: { type: String, required: true },
  sender: { type: ObjectId, ref: 'User', required: true },
  receiver: { type: ObjectId, ref: 'User', required: true },
  content: { type: String },
  has_read: { type: Boolean, default: false },
  create_at: { type: Date, default: Date.now },
});

MessageSchema.index({ create_at: -1 });

export default mongoose.model('Message', MessageSchema);
