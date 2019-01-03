import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  name: String,
  picture: String,
  sub: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
