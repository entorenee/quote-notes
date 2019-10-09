import { gql } from 'apollo-server-express';

import { fetchAuthor, fetchBooks } from '../../services/isbn-api';
import { ISBNBook } from '../../services/types';
import { QueryResolvers } from '../../generated/graphql';

export const typeDefs = gql`
  type ISBNBook {
    authors: [String!]!
    date_published: String!
    dewey_decimal: String
    dimensions: String
    edition: String
    excerpt: String
    format: String
    image: String
    isbn: String!
    isbn13: String!
    language: String
    msrp: Int
    overview: String
    pages: Int
    publisher: String
    reviews: [String!]
    subjects: [String!]
    synopsys: String
    title: String!
    title_long: String
  }

  extend type Query {
    isbnAuthor(name: String!): [ISBNBook!]!
    isbnBooks(name: String!): [ISBNBook!]!
  }
`;

interface Resolvers {
  Query: QueryResolvers;
}

export const resolvers: Resolvers = {
  Query: {
    isbnAuthor: (_, { name }): Promise<ISBNBook[]> => fetchAuthor(name),
    isbnBooks: (_, { name }): Promise<ISBNBook[]> => fetchBooks(name),
  },
};
