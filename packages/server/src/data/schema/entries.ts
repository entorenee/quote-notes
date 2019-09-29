import { gql } from 'apollo-server-express';

import {
  BookResolvers,
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
} from '../../generated/graphql';
import Entry from '../models/entry';
import { EntryModel, NullableEntry } from '../models/types';
import { updateFieldId } from '../user-methods';

export const typeDefs = gql`
  type Entry {
    id: ID!
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

  extend type Book {
    """
    A user's entries on the given Book
    """
    entries: [Entry]
  }

  extend type Query {
    myEntries: [Entry]
    entry(id: ID!): Entry
  }

  extend type Mutation {
    createEntry(input: NewEntryInput!): Entry
    updateEntry(input: UpdateEntryInput!): Entry
    removeEntry(id: ID!): ID
  }
`;

interface Resolvers {
  Book: BookResolvers;
  Mutation: MutationResolvers;
  Query: QueryResolvers;
  User: UserResolvers;
}

export const resolvers: Resolvers = {
  Query: {
    myEntries: async (_, args, { user }): Promise<EntryModel[] | null> => {
      if (!user) return null;

      const data = await Entry.find({ owner: user.id });

      return data.length ? data : null;
    },
    entry: (_, { id }): Promise<NullableEntry> => Entry.findById(id).exec(),
  },
  Mutation: {
    createEntry: async (_, { input }, { user }): Promise<NullableEntry> => {
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
    updateEntry: (_, { input }, { user }): Promise<NullableEntry> | null => {
      if (!user) return null;

      const { id: owner } = user;
      return Entry.findOneAndUpdate({ owner, _id: input.id }, input, {
        new: true,
      }).exec();
    },
    removeEntry: async (_, { id }, { user }): Promise<string | null> => {
      if (!user) return null;

      const { id: owner } = user;

      await updateFieldId({
        objectId: owner,
        field: 'entries',
        operator: '$pull',
        value: id,
      });

      const removed = await Entry.findOneAndRemove({ owner, _id: id });
      return removed !== null ? removed.id : null;
    },
  },
  User: {
    entries: ({ entries }): Promise<NullableEntry[]> =>
      Entry.find({
        _id: { $in: entries },
      }).exec(),
  },
  Book: {
    entries: ({ id }, args, { user }): Promise<NullableEntry[]> =>
      Entry.find({ book: id, owner: user.id }).exec(),
  },
};
