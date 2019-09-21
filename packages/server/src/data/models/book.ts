import { Document, model, Schema } from 'mongoose';

import { AuthorModel } from './author';

const { ObjectId } = Schema.Types;

export interface BookModel extends Document {
  id: string;
  authors: AuthorModel['_id'];
  isbn: string;
  publishedDate?: Date;
  synopsis?: string;
  title: string;
}

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
