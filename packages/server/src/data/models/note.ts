import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const noteSchema = new Schema({
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
  quote: Number,
});

module.exports = mongoose.model('Note', noteSchema);
