import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

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
