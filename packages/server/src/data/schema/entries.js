import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';
import { updateFieldId } from '../user-methods';

const Entry = mongoose.model('Entry');

export const typeDefs = gql`
  type Entry {
    id: ID!
    book: Book!
    """
    Chapter relating to the note
    """
    chapter: String
    """
    Database generated timestamp of entry creation
    """
    createdAt: DateTime!
    """
    User supplied notes for the entry
    """
    notes: String
    owner: User!
    """
    Page the notes are referencing
    """
    page: Int
    """
    Quoted text from the book
    """
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
    allEntries: [Entry]
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
    allEntries: async (_, args, { user }) => {
      if (!user) return null;

      const data = await Entry.find({ owner: user.id });

      return data.length ? data : null;
    },
    entry: (_, { id }) => Entry.findById(id),
  },
  Mutation: {
    createEntry: async (_, { input }, { user }) => {
      if (!user) return null;

      const { id: owner } = user;
      const data = {
        ...input,
        owner,
      };

      const entry = new Entry(data);
      const newEntry = await entry.save();
      const { id: entryId } = newEntry;
      await updateFieldId({
        objectId: owner,
        field: 'entries',
        operator: '$push',
        value: entryId,
      });

      return newEntry;
    },
    updateEntry: async (_, { input }, { user }) => {
      if (!user) return null;

      const { id: owner } = user;
      return Entry.findOneAndUpdate({ _id: input.id, owner }, input, {
        new: true,
      });
    },
    removeEntry: async (_, { id }, { user }) => {
      if (!user) return null;

      const { id: owner } = user;

      await updateFieldId({
        objectId: owner,
        field: 'entries',
        operator: '$pull',
        value: id,
      });

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
