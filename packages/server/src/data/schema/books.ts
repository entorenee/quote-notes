import {
  idArg,
  mutationField,
  objectType,
  stringArg,
  queryField,
} from '@nexus/schema';

import { AuthorsEntity, EntriesEntity } from '../../generated/db-types';

import { BookBase, NodeType, Timestamps, UserJoinedBook } from './shared';

export const ISBNBookDBType = objectType({
  name: 'ISBNDatabaseBook',
  description: 'A stored subset of fields from the ISBN API for a given book',
  definition(t): void {
    t.implements(NodeType);
    t.implements(BookBase);
  },
});

export const UserBook = objectType({
  name: 'UserBook',
  description:
    'An augmented ISBN Book, with additional user controlled properties',
  definition(t): void {
    t.implements(BookBase, NodeType, Timestamps);
    t.id('isbnBookId', {
      description: 'A foreign key to the canonical ISBN Book',
    });
    t.int('rating', {
      description: `A user's rating of a book on a scale of 1-5`,
      nullable: true,
    });
    t.string('synopsis', {
      description: 'Synopsis of the book',
      nullable: true,
    });
    t.list.field('authors', {
      type: 'Author',
      description: 'A list of authors for a given book',
      resolve({ isbnBookId }, _, { author }): Promise<AuthorsEntity[]> {
        return author.bookAuthors(isbnBookId);
      },
    });
    t.list.field('entries', {
      type: 'Entry',
      description: `A user's entries on the given Book`,
      resolve({ id }, args, { entry }): Promise<EntriesEntity[]> {
        return entry.byBookId(id);
      },
    });
  },
});

export const book = queryField('userBook', {
  type: UserBook,
  nullable: true,
  args: {
    id: stringArg({ required: true }),
  },
  resolve(_, { id }, ctx): Promise<UserJoinedBook | null> {
    return ctx.book.userBookById(id);
  },
});

export const addToMyBooks = mutationField('addToMyBooks', {
  type: UserBook,
  args: {
    isbn: stringArg({ required: true }),
  },
  resolve(_, { isbn }, ctx): Promise<UserJoinedBook> {
    return ctx.book.createUserBook(isbn);
  },
});

export const removeMyBook = mutationField('removeMyBook', {
  type: 'ID',
  args: {
    id: idArg({ required: true }),
  },
  resolve(_, { id }, ctx): Promise<string> {
    return ctx.book.deleteUserBook(id);
  },
});
