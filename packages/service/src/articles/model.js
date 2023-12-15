import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const ArticleSchema = new mongoose.Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: Number, default: 0 },
  read_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  collect_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

ArticleSchema.index({ create_at: -1 });

export default mongoose.model('Article', ArticleSchema);
