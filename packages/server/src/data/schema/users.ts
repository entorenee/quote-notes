import {
  arg,
  mutationField,
  inputObjectType,
  objectType,
  queryField,
} from '@nexus/schema';

import { EntriesEntity, UsersEntity } from '../../generated/db-types';
import { NodeType, Timestamps, UserJoinedBook } from './shared';

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
      type: 'UserBook',
      description: `A user's collection of books to take notes on`,
      resolve({ id }, _, { book }): Promise<UserJoinedBook[]> {
        return book.userBooks(id);
      },
    });
    t.list.field('entries', {
      type: 'Entry',
      description: `A user's stored entries`,
      resolve({ id }, _, { entry }): Promise<EntriesEntity[]> {
        return entry.byUserId(id);
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
  resolve(_, args, { user }): Promise<UsersEntity | null> {
    return user.currentUser();
  },
});

export const myBooks = queryField('myBooks', {
  type: 'UserBook',
  list: true,
  nullable: true,
  resolve(_, args, { book }): Promise<UserJoinedBook[] | null> {
    return book.currUserBooks();
  },
});

export const updateUser = mutationField('updateUser', {
  type: User,
  nullable: true,
  args: {
    user: arg({ type: UserInput, required: true }),
  },
  resolve: (_, { user }, ctx): Promise<UsersEntity | null> => {
    return ctx.user.updateUser(user);
  },
});
