import * as mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export interface UserModel extends mongoose.Document {
  id: string;
  books: string[];
  createdAt: Date;
  entries: string[];
  name?: string;
  picture?: string;
  sub: string;
}

const userSchema = new Schema({
  books: [
    {
      type: ObjectId,
      ref: 'Book',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  entries: [
    {
      type: ObjectId,
      ref: 'Entry',
    },
  ],
  name: String,
  picture: String,
  sub: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
