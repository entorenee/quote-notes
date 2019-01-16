import * as mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export interface BookModel extends mongoose.Document {
  id: string;
  authors: string[];
  isbn: string;
  publishedDate?: Date;
  synopsis?: string;
  title: string;
}

const bookSchema = new Schema({
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

module.exports = mongoose.model('Book', bookSchema);
