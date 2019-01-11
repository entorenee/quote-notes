import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

const Book = mongoose.model('Book');

export const typeDefs = gql`
  type Book {
    id: ID!
    """
    ISBN number of the book
    """
    isbn: String
    """
    Date of first publication
    """
    publishedDate: DateTime
    """
    Synopsis of the book
    """
    synopsis: String
    """
    Book's title
    """
    title: String!
  }

  extend type Author {
    """
    Other books written by the author and also stored in the database
    """
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
