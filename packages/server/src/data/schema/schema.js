import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar DateTime

  type User {
    name: String
    notes: [Note]
    picture: String
    sub: String!
  }

  input UserInput {
    name: String
    picture: String
    sub: String!
  }

  type Author {
    name: String!
    booksWritten: [Book]
  }

  type Book {
    authors: [Author]
    isbn: String
    publishedDate: DateTime
    synopsis: String
    title: String!
  }

  type Note {
    book: Book!
    chapter: String
    createdAt: DateTime!
    notes: String
    owner: User!
    page: Int
    quote: String
  }

  type Query {
    me: User
  }

  type Mutation {
    updateUser(user: UserInput): User
  }
`;
