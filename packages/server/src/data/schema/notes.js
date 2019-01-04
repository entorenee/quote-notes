import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

const Note = mongoose.model('Note');

export const typeDefs = gql`
  type Note {
    id: ID!
    book: Book
    chapter: String
    createdAt: DateTime!
    notes: String
    owner: User
    page: Int
    quote: String
  }

  extend type User {
    notes: [Note]
  }
`;

export const resolvers = {
  User: {
    notes: ({ notes }) =>
      Note.find({
        _id: { $in: notes },
      }),
  },
  Note: {
    __resolveObject(object) {
      return Note.findById(object.id);
    },
    book: ({ book }) => ({ id: book }),
    owner: ({ owner }) => ({ id: owner }),
  },
};
