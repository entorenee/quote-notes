import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    name: String
    picture: String
    sub: String!
  }

  input UserInput {
    name: String
    picture: String
    sub: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    updateUser(user: UserInput): User
  }
`;
