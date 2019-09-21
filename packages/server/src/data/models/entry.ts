import { Document, model, Schema } from 'mongoose';

import { BookModel } from './book';
import { UserModel } from './user';

const { ObjectId } = Schema.Types;

export interface EntryModel extends Document {
  id: string;
  book: BookModel['_id'];
  chapter: string;
  createdAt: Date;
  notes: string;
  owner: UserModel['_id'];
  page: number;
  quote: string;
}

const entriesSchema: Schema = new Schema({
  book: {
    type: ObjectId,
    ref: 'Book',
    required: true,
  },
  chapter: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  notes: String,
  owner: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  page: Number,
  quote: String,
});

export default model<EntryModel>('Entry', entriesSchema, 'entries');
