import mongoose from 'mongoose';
import dateTime from './custom-scalars/date-time';

const Author = mongoose.model('Author');
const Book = mongoose.model('Book');
const Note = mongoose.model('Note');
const User = mongoose.model('User');

const resolvers = {
  DateTime: dateTime,
  Query: {
    me: (_, args, { user }) => {
      if (user) {
        return User.findOne({ sub: user.sub });
      }

      return null;
    },
  },
  Mutation: {
    updateUser: (_, { user }) => {
      if (user) {
        return User.findOneAndUpdate({ sub: user.sub }, user, {
          upsert: true,
          new: true,
        });
      }

      return null;
    },
  },
  Author: {
    booksWritten: ({ booksWritten }) =>
      Book.find({
        _id: { $in: booksWritten },
      }),
  },
  Book: {
    authors: ({ authors }) =>
      Author.find({
        _id: { $in: authors },
      }),
  },
  Note: {
    book: ({ book }) => Book.findById(book),
    owner: ({ owner }) => User.findById(owner),
  },
  User: {
    notes: ({ notes }) =>
      Note.find({
        _id: { $in: notes },
      }),
  },
};

export default resolvers;
