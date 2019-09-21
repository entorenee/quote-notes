import { Document, model, Schema } from 'mongoose';

import { BookModel } from './book'

const { ObjectId } = Schema.Types;

export interface AuthorModel extends Document {
  id: string;
  booksWritten: BookModel['_id'];
  name: string;
}

const authorSchema: Schema = new Schema({
  booksWritten: [
    {
      type: ObjectId,
      ref: 'Book',
    },
  ],
  name: {
    type: String,
    required: true,
  },
});

export default model<AuthorModel>('Author', authorSchema);
