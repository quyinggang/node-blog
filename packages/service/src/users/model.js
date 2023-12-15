import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  follower: { type: [ObjectId] },
  following: { type: [ObjectId] },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

// 建立索引
UserSchema.index({ name: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

// 在findByIdAndUpdate更新文档前做相关处理
UserSchema.pre('findByIdAndUpdate', function (next) {
  const follower = this.follower;
  const following = this.following;
  this.follower = [...new Set(follower)];
  this.following = [...new Set(following)];
  next();
});

export default mongoose.model('User', UserSchema);
