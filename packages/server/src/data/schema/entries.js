import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

const Entry = mongoose.model('Entry');

export const typeDefs = gql`
  type Entry {
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
    entries: [Entry]
  }

  extend type Query {
    entry(id: ID!): Entry
  }
`;

export const resolvers = {
  Query: {
    entry: (_, { id }) => Entry.findById(id),
  },
  User: {
    entries: ({ entries }) =>
      Entry.find({
        _id: { $in: entries },
      }),
  },
  Entry: {
    __resolveObject(object) {
      return Entry.findById(object.id);
    },
    book: ({ book }) => ({ id: book }),
    owner: ({ owner }) => ({ id: owner }),
  },
};
