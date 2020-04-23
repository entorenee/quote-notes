/* eslint @typescript-eslint/ban-ts-ignore: "warn" */
import {
  arg,
  idArg,
  inputObjectType,
  mutationField,
  objectType,
  queryField,
} from '@nexus/schema';

import {
  EntryModel,
  NullableBook,
  NullableEntry,
  NullableUser,
} from '../models/types';
import { NodeType } from './shared';

export const Entry = objectType({
  name: 'Entry',
  definition(t) {
    t.implements(NodeType);
    t.field('book', {
      type: 'Book',
      nullable: true,
      // @ts-ignore
      resolve({ book: id }, _, { db }): Promise<NullableBook> {
        return db.Book.findById(id).exec();
      },
    });
    t.string('chapter', {
      description: 'Chapter relating to the note',
      nullable: true,
    });
    t.date('createdAt', {
      description: 'Database generated timestamp of entry creation',
    });
    t.string('notes', {
      description: 'User supplied notes for the entry',
      nullable: true,
    });
    t.field('owner', {
      type: 'User',
      nullable: true,
      // @ts-ignore
      resolve({ owner: id }, _, { db }): Promise<NullableUser> {
        return db.User.findById(id).exec();
      },
    });
    t.int('page', {
      description: 'Page the notes are referencing',
      nullable: true,
    });
    t.string('quote', {
      description: 'Quoted text from the book',
      nullable: true,
    });
  },
});

export const NewEntryInput = inputObjectType({
  name: 'NewEntryInput',
  definition(t) {
    t.id('book', { required: true });
    t.string('chapter');
    t.string('notes');
    t.int('page');
    t.string('quote');
  },
});

export const UpdateEntryInput = inputObjectType({
  name: 'UpdateEntryInput',
  definition(t) {
    t.id('id', { required: true });
    t.string('chapter');
    t.string('notes');
    t.int('page');
    t.string('quote');
  },
});

export const myEntries = queryField('myEntries', {
  type: Entry,
  list: true,
  nullable: true,
  resolve: async (_, args, { db, user }): Promise<EntryModel[] | null> => {
    if (!user) return null;

    const data = await db.Entry.find({ owner: user.id });

    return data.length ? data : null;
  },
});

export const entry = queryField('entry', {
  type: Entry,
  nullable: true,
  args: {
    id: idArg({ required: true }),
  },
  resolve(_, { id }, { db }): Promise<NullableEntry> {
    return db.Entry.findById(id).exec();
  },
});

export const createEntry = mutationField('createEntry', {
  type: Entry,
  nullable: true,
  args: {
    input: arg({ type: NewEntryInput, required: true }),
  },
  resolve: async (_, { input }, { db, user }): Promise<NullableEntry> => {
    if (!user) return null;

    const { id: owner } = user;
    const data = {
      ...input,
      owner,
    };

    const newEntry = new db.Entry(data);
    const savedEntry = await newEntry.save();

    return savedEntry;
  },
});

export const updateEntry = mutationField('updateEntry', {
  type: Entry,
  nullable: true,
  args: {
    input: arg({ type: UpdateEntryInput, required: true }),
  },
  resolve(_, { input }, { db, user }): Promise<NullableEntry> | null {
    if (!user) return null;

    const { id: owner } = user;
    return db.Entry.findOneAndUpdate({ owner, _id: input.id }, input, {
      new: true,
    }).exec();
  },
});

export const removeEntry = mutationField('removeEntry', {
  type: 'ID',
  nullable: true,
  args: {
    id: idArg({ required: true }),
  },
  resolve: async (_, { id }, { db, user }): Promise<string | null> => {
    if (!user) return null;

    const { id: owner } = user;

    const removed = await db.Entry.findOneAndRemove({ owner, _id: id });
    return removed !== null ? removed.id : null;
  },
});
