import { gql } from 'apollo-server-express';

import {
  AuthorResolvers,
  EntryResolvers,
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
} from '../../generated/graphql';
import { NullableBook, NullableUser } from '../models/types';
import addToMyBooks from '../controllers/add-to-my-books';
import removeMyBook from '../controllers/remove-my-book';

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
    removeMyBook(id: ID!): User
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
    allBooks: (_, __, { db: { Book } }): Promise<NullableBook[]> =>
      Book.find({}).exec(),
    book: (_, { id }, { db: { Book } }): Promise<NullableBook> =>
      Book.findById(id).exec(),
  },
  Mutation: {
    addToMyBooks: (_, { isbn }, { user }): Promise<NullableBook> => {
      return addToMyBooks(isbn, user);
    },
    removeMyBook: (_, { id }, { user }): Promise<NullableUser> =>
      removeMyBook(id, user),
  },
  User: {
    books: ({ books }, _, { db: { Book } }): Promise<NullableBook[]> =>
      Book.find({
        _id: { $in: books },
      }).exec(),
  },
  Author: {
    booksWritten: (
      { booksWritten },
      _,
      { db: { Book } },
    ): Promise<NullableBook[]> =>
      Book.find({
        _id: { $in: booksWritten },
      }).exec(),
  },
  Entry: {
    book: ({ book: id }, _, { db: { Book } }): Promise<NullableBook> =>
      Book.findById(id).exec(),
  },
};
