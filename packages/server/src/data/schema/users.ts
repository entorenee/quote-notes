import { gql } from 'apollo-server-express';

import {
  DateTimeScalarConfig,
  EntryResolvers,
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
} from '../../generated/graphql';
import User from '../models/user';
import dateTime from './custom-scalars/date-time';

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    """
    User's name from oAuth provider
    """
    name: String
    """
    User's profile image from oAuth provider
    """
    picture: String
    """
    Unique oAuth identifier
    """
    sub: String!
  }

  input UserInput {
    name: String
    picture: String
    sub: String!
  }

  extend type Entry {
    owner: User
  }

  extend type Query {
    me: User
    myBooks: [Book]
  }

  extend type Mutation {
    updateUser(user: UserInput!): User
  }
`;

interface Resolvers {
  DateTime: DateTimeScalarConfig;
  Entry: EntryResolvers;
  Mutation: MutationResolvers;
  Query: QueryResolvers;
  User: UserResolvers;
}

export const resolvers: Resolvers = {
  // eslint-disable-next-line
  // @ts-ignore
  DateTime: dateTime,
  Entry: {
    owner: ({ owner: id }) => User.findById(id).exec(),
  },
  Query: {
    me: (_, args, { user }) => {
      if (user) {
        return User.findOne({ sub: user.sub }).exec();
      }

      return null;
    },
    myBooks: async (_, args, { user }) => {
      if (user) {
        const data = await User.findById(user.id, 'books')
          .populate('books')
          .exec();
        return data ? data.books : null;
      }

      return null;
    },
  },
  Mutation: {
    updateUser: (_, { user }) => {
      if (user) {
        return User.findOneAndUpdate({ sub: user.sub }, user, {
          upsert: true,
          new: true,
        }).exec();
      }

      return null;
    },
  },
};
