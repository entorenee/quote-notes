import * as mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export interface UserModel extends mongoose.Document {
  id: string;
  book: string;
  chapter: string;
  createdAt: Date;
  notes: string;
  owner: string;
  page: number;
  quote: string;
}

const entriesSchema = new Schema({
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

module.exports = mongoose.model('Entry', entriesSchema, 'entries');
