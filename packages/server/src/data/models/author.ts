import { model, Schema } from 'mongoose';

import { AuthorModel } from './types';

const { ObjectId } = Schema.Types;

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
