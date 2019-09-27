import { gql } from 'apollo-server-express';

import { fetchBooks } from '../../services/isbn-api';
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
    isbnBooks(name: String!): [ISBNBook!]!
  }
`;

interface Resolvers {
  Query: QueryResolvers;
}

export const resolvers: Resolvers = {
  Query: {
    isbnBooks: (_, { name }) => fetchBooks(name),
  },
};
