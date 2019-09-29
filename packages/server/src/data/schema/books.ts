import { gql } from 'apollo-server-express';

import {
  AuthorResolvers,
  EntryResolvers,
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
} from '../../generated/graphql';
import Book from '../models/book';
import { addToMyBooks } from '../controllers/add-to-my-books';

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

  extend type Entry {
    book: Book
  }

  extend type Query {
    allBooks: [Book]
    book(id: ID!): Book
  }

  extend type Mutation {
    addToMyBooks(isbn: String!): Book
  }
`;

interface Resolvers {
  Author: AuthorResolvers;
  Entry: EntryResolvers;
  Mutation: MutationResolvers;
  User: UserResolvers;
  Query: QueryResolvers;
}

export const resolvers: Resolvers = {
  Query: {
    allBooks: () => Book.find({}).exec(),
    book: (_, { id }) => Book.findById(id).exec(),
  },
  Mutation: {
    addToMyBooks: (_, { isbn }, { user }) => {
      return addToMyBooks(isbn, user);
    },
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
  Entry: {
    book: ({ book: id }) => Book.findById(id).exec(),
  },
};
