import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

const Author = mongoose.model('Author');

export const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
  }

  extend type Book {
    """
    A list of authors for a given book
    """
    authors: [Author]
  }

  extend type Query {
    allAuthors: [Author]
    author(id: ID!): Author
  }
`;

export const resolvers = {
  Query: {
    allAuthors: () => Author.find({}),
    author: (_, { id }) => Author.findById(id),
  },
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
