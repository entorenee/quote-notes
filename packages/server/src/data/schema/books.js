import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

const Book = mongoose.model('Book');

export const typeDefs = gql`
  type Book {
    id: ID!
    isbn: String
    publishedDate: DateTime
    synopsis: String
    title: String!
  }

  extend type Author {
    booksWritten: [Book]
  }

  extend type Query {
    allBooks: [Book]
    book(id: ID!): Book
  }
`;

export const resolvers = {
  Query: {
    allBooks: () => Book.find({}),
    book: (_, { id }) => Book.findById(id),
  },
  Author: {
    booksWritten: ({ booksWritten }) =>
      Book.find({
        _id: { $in: booksWritten },
      }),
  },
  Book: {
    __resolveObject(object) {
      return Book.findById(object.id);
    },
  },
};
