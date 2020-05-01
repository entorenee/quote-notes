/* eslint @typescript-eslint/ban-ts-ignore: "warn" */
import {
  arg,
  mutationField,
  inputObjectType,
  objectType,
  queryField,
} from '@nexus/schema';

import { BookModel, EntryModel, NullableUser } from '../models/types';
import { NodeType, Timestamps } from './shared';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.implements(NodeType, Timestamps);
    t.string('name', {
      description: `User's name from oAuth provider`,
      nullable: true,
    });
    t.string('sub', { description: 'Unique oAuth provider' });
    t.list.field('books', {
      // @ts-ignore
      type: 'UserBook',
      description: `A user's collection of books to take notes on`,
      // @ts-ignore
      resolve({ books }, _, { db }): Promise<BookModel[]> {
        return db.Book.find({
          _id: { $in: books },
        }).exec();
      },
    });
    t.list.field('entries', {
      type: 'Entry',
      description: `A user's stored entries`,
      resolve({ id }, _, { db }): Promise<EntryModel[]> {
        return db.Entry.find({
          owner: id,
        }).exec();
      },
    });
  },
});

export const UserInput = inputObjectType({
  name: 'UserInput',
  definition(t) {
    t.string('name');
    t.string('picture');
    t.string('sub');
  },
});

export const me = queryField('me', {
  type: User,
  nullable: true,
  resolve(_, args, { db, user }): Promise<NullableUser> | null {
    if (user) {
      return db.User.findOne({ sub: user.sub }).exec();
    }

    return null;
  },
});

// @ts-ignore
export const myBooks = queryField('myBooks', {
  type: 'UserBook',
  list: true,
  nullable: true,
  resolve: async (_, args, { db, user }): Promise<BookModel[] | null> => {
    if (user) {
      const data = await db.User.findById(user.id, 'books')
        .populate('books')
        .exec();
      return data ? data.books : null;
    }

    return null;
  },
});

export const updateUser = mutationField('updateUser', {
  type: User,
  nullable: true,
  args: {
    user: arg({ type: UserInput, required: true }),
  },
  resolve: (_, { user }, { db }): Promise<NullableUser> | null => {
    if (user) {
      return db.User.findOneAndUpdate({ sub: user.sub }, user, {
        upsert: true,
        new: true,
      }).exec();
    }

    return null;
  },
});
