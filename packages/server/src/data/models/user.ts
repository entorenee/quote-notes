import { model, Schema } from 'mongoose';

import { UserModel } from './types';

const { ObjectId } = Schema.Types;

const userSchema: Schema = new Schema({
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
  name: String,
  picture: String,
  sub: {
    type: String,
    required: true,
  },
});

export default model<UserModel>('User', userSchema);
