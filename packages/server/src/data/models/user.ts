import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  name: String,
  entries: [
    {
      type: ObjectId,
      ref: 'Entry',
    },
  ],
  picture: String,
  sub: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
