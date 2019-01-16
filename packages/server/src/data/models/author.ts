import * as mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types

export interface AuthorModel extends mongoose.Document {
  id: string;
  booksWritten: string[];
  name: string;
}

const authorSchema = new Schema({
  booksWritten: [{
    type: ObjectId,
    ref: 'Book'
  }],
  name: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Author', authorSchema);
