import { objectType, stringArg, queryField } from '@nexus/schema';

import { AuthorModel, BookModel, NullableAuthor } from '../models/types';
import { NodeType } from './shared';

export const Author = objectType({
  name: 'Author',
  definition(t) {
    t.implements(NodeType);
    t.string('name');
    t.list.field('booksWritten', {
      type: 'Book',
      description:
        'Other books written by the author and also stored in the database',
      // @ts-ignore
      resolve({ booksWritten }, _, { db }): Promise<BookModel[]> {
        return db.Book.find({
          _id: { $in: booksWritten },
        }).exec();
      },
    });
  },
});

export const allAuthors = queryField('allAuthors', {
  type: Author,
  nullable: true,
  list: true,
  resolve(_, __, { db }): Promise<AuthorModel[]> {
    return db.Author.find({}).exec();
  },
});

export const author = queryField('author', {
  type: Author,
  nullable: true,
  args: {
    id: stringArg({ required: true }),
  },
  resolve(_, { id }, { db }): Promise<NullableAuthor> {
    return db.Author.findById(id).exec();
  },
});
