import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

const Entry = mongoose.model('Entry');
const User = mongoose.model('User');

export const typeDefs = gql`
  type Entry {
    id: ID!
    book: Book
    chapter: String
    createdAt: DateTime!
    notes: String
    owner: User
    page: Int
    quote: String
  }

  input NewEntryInput {
    book: ID!
    chapter: String
    notes: String
    page: Int
    quote: String
  }

  input UpdateEntryInput {
    id: ID!
    chapter: String
    notes: String
    page: Int
    quote: String
  }

  extend type User {
    entries: [Entry]
  }

  extend type Query {
    entry(id: ID!): Entry
  }

  extend type Mutation {
    createEntry(input: NewEntryInput): Entry
    updateEntry(input: UpdateEntryInput): Entry
    removeEntry(id: ID!): ID
  }
`;

export const resolvers = {
  Query: {
    entry: (_, { id }) => Entry.findById(id),
  },
  Mutation: {
    createEntry: async (_, { input }, { user }) => {
      if (!user) return null;

      const userObj = await User.findOne({ sub: user.sub });
      if (!userObj) return null;

      const { id: owner } = userObj;
      const data = {
        ...input,
        owner,
      };

      const entry = new Entry(data);
      const newEntry = await entry.save();
      const { id: entryId } = newEntry;
      await User.findByIdAndUpdate(
        owner,
        { $push: { entries: entryId } },
        { new: true },
      );

      return newEntry;
    },
    updateEntry: async (_, { input }, { user }) => {
      if (!user) return null;

      const userObj = await User.findOne({ sub: user.sub });
      if (!userObj) return null;

      const { id: owner } = userObj;
      return Entry.findOneAndUpdate({ _id: input.id, owner }, input, {
        new: true,
      });
    },
    removeEntry: async (_, { id }, { user }) => {
      if (!user) return null;

      const userObj = await User.findOne({ sub: user.sub });
      if (!userObj) return null;

      const { id: owner } = userObj;

      await User.findByIdAndUpdate(
        owner,
        { $pull: { entries: id } },
        { new: true },
      );

      const removed = await Entry.findOneAndRemove({ _id: id, owner });
      return removed.id;
    },
  },
  User: {
    entries: ({ entries }) =>
      Entry.find({
        _id: { $in: entries },
      }),
  },
  Entry: {
    __resolveObject(object) {
      return Entry.findById(object.id);
    },
    book: ({ book }) => ({ id: book }),
    owner: ({ owner }) => ({ id: owner }),
  },
};
