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
    myBooks: [Book]
  }

  extend type Mutation {
    updateUser(user: UserInput!): User
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
        });
      }

      return null;
    },
  },
};
