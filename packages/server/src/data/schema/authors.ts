/* eslint @typescript-eslint/ban-ts-ignore: "warn" */
import { objectType, stringArg, queryField } from '@nexus/schema';

import { AuthorsEntity, IsbnBooksEntity } from '../../generated/db-types';

import { NodeType } from './shared';

export const Author = objectType({
  name: 'Author',
  definition(t) {
    t.implements(NodeType);
    t.string('name');
    t.list.field('booksWritten', {
      // @ts-ignore
      type: 'ISBNDatabaseBook',
      description:
        'Other books written by the author and also stored in the database',
      resolve({ id }, _, { book }): Promise<IsbnBooksEntity[]> {
        return book.booksWritten(id);
      },
    });
  },
});

export const allAuthors = queryField('allAuthors', {
  type: Author,
  nullable: true,
  list: true,
  resolve(_, __, { author }): Promise<AuthorsEntity[]> {
    return author.allAuthors();
  },
});

export const author = queryField('author', {
  type: Author,
  nullable: true,
  args: {
    id: stringArg({ required: true }),
  },
  resolve(_, { id }, ctx): Promise<AuthorsEntity | null> {
    return ctx.author.byId(id);
  },
});
