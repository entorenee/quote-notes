import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  picture: String,
  sub: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
