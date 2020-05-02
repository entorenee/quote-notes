import {
  arg,
  idArg,
  inputObjectType,
  mutationField,
  objectType,
  queryField,
} from '@nexus/schema';

import { EntriesEntity, UsersEntity } from '../../generated/db-types';

import { NodeType, Timestamps, UserJoinedBook } from './shared';

export const Entry = objectType({
  name: 'Entry',
  definition(t) {
    t.implements(NodeType, Timestamps);
    t.id('userBookId', {
      description: 'Foreign key to the associated user book for the entry',
    });
    t.id('userId', {
      description: 'Foreign key to the associated owner of the entry',
    });
    t.field('book', {
      type: 'UserBook',
      nullable: true,
      resolve({ userBookId }, _, { book }): Promise<UserJoinedBook | null> {
        return book.userBookById(userBookId);
      },
    });
    t.string('title', {
      description: 'Display title of the entry',
    });
    t.string('chapter', {
      description: 'Chapter relating to the note',
      nullable: true,
    });
    t.string('notes', {
      description: 'User supplied notes for the entry',
      nullable: true,
    });
    t.field('owner', {
      type: 'User',
      nullable: true,
      resolve({ userId }, _, { user }): Promise<UsersEntity | null> {
        return user.byId(userId);
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
    t.id('userBookId', { required: true });
    t.string('title', { required: true });
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
    t.string('title');
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
  resolve: (_, args, { entry }): Promise<EntriesEntity[] | null> => {
    return entry.currentUserEntries();
  },
});

export const entry = queryField('entry', {
  type: Entry,
  nullable: true,
  args: {
    id: idArg({ required: true }),
  },
  resolve(_, { id }, ctx): Promise<EntriesEntity | null> {
    return ctx.entry.byId(id);
  },
});

export const createEntry = mutationField('createEntry', {
  type: Entry,
  args: {
    input: arg({ type: NewEntryInput, required: true }),
  },
  resolve(_, { input }, ctx): Promise<EntriesEntity> {
    return ctx.entry.createEntry(input);
  },
});

export const updateEntry = mutationField('updateEntry', {
  type: Entry,
  args: {
    input: arg({ type: UpdateEntryInput, required: true }),
  },
  resolve(_, { input }, ctx): Promise<EntriesEntity> {
    return ctx.entry.updateEntry(input);
  },
});

export const removeEntry = mutationField('removeEntry', {
  type: 'ID',
  args: {
    id: idArg({ required: true }),
  },
  resolve(_, { id }, ctx): Promise<string> {
    return ctx.entry.deleteEntry(id);
  },
});
