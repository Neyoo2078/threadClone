import { Schema, models, model } from 'mongoose';
import mongoose from 'mongoose';

const ThreadSchema = new Schema({
  message: { type: String, require: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  likes: [{ type: String }],
  pictureMessage: [{ type: String }],
  parentId: { type: String },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Threads' }],
  createdAt: { type: Date, default: Date.now() },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
});

const Threads = models?.Threads || model('Threads', ThreadSchema);

export default Threads;
