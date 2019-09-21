import { gql } from 'apollo-server-express';

import {
  AuthorResolvers,
  BookResolvers,
  QueryResolvers,
  UserResolvers,
} from '../../generated/graphql';
import Author from '../models/author';
import Book from '../models/book';
import Entry from '../models/entry';

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

  extend type User {
    """
    A user's collection of books to take notes on
    """
    books: [Book]
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

interface Resolvers {
  Author: AuthorResolvers;
  Book: BookResolvers;
  User: UserResolvers;
  Query: QueryResolvers;
}

export const resolvers: Resolvers = {
  Query: {
    allBooks: () => Book.find({}).exec(),
    book: (_, { id }) => Book.findById(id).exec(),
  },
  User: {
    books: ({ books }) =>
      Book.find({
        _id: { $in: books },
      }).exec(),
  },
  Author: {
    booksWritten: ({ booksWritten }) =>
      Book.find({
        _id: { $in: booksWritten },
      }).exec(),
  },
  Book: {
    authors: ({ authors }) =>
      Author.find({
        _id: { $in: authors },
      }).exec(),
    entries: ({ id }, args, { user }) =>
      !user ? [] : Entry.find({ book: id, owner: user.id }).exec(),
  },
};
