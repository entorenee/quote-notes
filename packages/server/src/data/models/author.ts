import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types

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
