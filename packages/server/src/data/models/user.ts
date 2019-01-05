import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export interface User {
  id: string;
  createdAt: Date;
  name: string;
  entries: string[];
  picture: string;
  sub: string;
}

const userSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  name: String,
  entries: [
    {
      type: ObjectId,
      ref: 'Entry',
    },
  ],
  picture: String,
  sub: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
