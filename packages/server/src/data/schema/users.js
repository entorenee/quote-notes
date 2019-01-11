import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

import dateTime from './custom-scalars/date-time';

const User = mongoose.model('User');

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

  extend type Query {
    me: User
    allEntries: [Entry]
  }

  extend type Mutation {
    updateUser(user: UserInput): User
  }
`;

export const resolvers = {
  DateTime: dateTime,
  User: {
    __resolveObject(object) {
      return User.findById(object.id);
    },
  },
  Query: {
    me: (_, args, { user }) => {
      if (user) {
        return User.findOne({ sub: user.sub });
      }

      return null;
    },
    allEntries: async (_, args, { user }) => {
      if (!user) return null;

      const data = await User.findOne({ sub: user.sub }, 'entries')
        .populate('entries')
        .exec();

      return data ? data.entries : null;
    },
  },
  Mutation: {
    updateUser: (_, { user }) => {
      if (user) {
        return User.findOneAndUpdate({ sub: user.sub }, user, {
          upsert: true,
          new: true,
        });
      }

      return null;
    },
  },
};
