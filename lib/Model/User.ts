import { Schema, models, model } from 'mongoose';
import mongoose from 'mongoose';

const UserSchema = new Schema({
  userid: { type: String, unique: [true, 'multiple Id'] },
  name: { type: String, unique: [true, 'name already exist'] },
  username: { type: String, unique: [true, 'name already exist'] },
  bio: { type: String },
  image: { type: String },
  banner: { type: String },
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Threads' }],
  onboarded: { type: Boolean, default: false },
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
});

const Users = models?.User || model('User', UserSchema);

export default Users;
