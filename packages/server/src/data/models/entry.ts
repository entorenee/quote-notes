import { model, Schema } from 'mongoose';

import { EntryModel } from './types';

const { ObjectId } = Schema.Types;

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
