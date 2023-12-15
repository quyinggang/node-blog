import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const CommentSchema = new mongoose.Schema({
  topic: {
    id: { type: ObjectId, required: true },
    type: { type: Number, default: 0 },
  },
  user: { type: ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  root_comment_id: { type: ObjectId },
  parent_comment_id: { type: ObjectId },
  like_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

CommentSchema.index({ create_at: -1 });

export default mongoose.model('Comment', CommentSchema);
