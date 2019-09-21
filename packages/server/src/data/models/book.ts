import { model, Schema } from 'mongoose';

import { BookModel } from './types';

const { ObjectId } = Schema.Types;

const bookSchema: Schema = new Schema({
  authors: [
    {
      type: ObjectId,
      ref: 'Author',
    },
  ],
  isbn: {
    type: String,
    required: true,
  },
  publishedDate: Date,
  synopsis: String,
  title: {
    type: String,
    required: true,
  },
});

export default model<BookModel>('Book', bookSchema);
