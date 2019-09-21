import { Document, model, Schema } from 'mongoose';

import { BookModel } from './book';
import { EntryModel } from './entry';

const { ObjectId } = Schema.Types;

export interface UserModel extends Document {
  id: string;
  books: BookModel['_id'];
  createdAt: Date;
  entries: EntryModel['_id'];
  name?: string;
  picture?: string;
  sub: string;
}

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

export default model<UserModel>('User', userSchema);
