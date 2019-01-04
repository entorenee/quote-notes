import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

const Author = mongoose.model('Author');

export const typeDefs = gql`
  type Author {
    id: ID
    name: String!
  }

  extend type Book {
    authors: [Author]
  }
`;

export const resolvers = {
  Author: {
    __resolveObject(object) {
      return Author.findById(object.id);
    },
  },
  Book: {
    authors: ({ authors }) =>
      Author.find({
        _id: { $in: authors },
      }),
  },
};
