import { objectType, stringArg, queryField } from '@nexus/schema';

import { fetchAuthor, fetchBooks } from '../../services/isbn-api';
import { ISBNBook } from '../../services/types';
import { BookBase } from './shared';

export const ISBNBookAPIType = objectType({
  name: 'ISBNAPIBook',
  description: 'Raw response from the ISBN Database API',
  definition(t) {
    t.implements(BookBase);
    t.list.string('authors', { nullable: true });
    t.string('date_published');
    t.string('dewey_decimal', { nullable: true });
    t.string('dimensions', { nullable: true });
    t.string('edition', { nullable: true });
    t.string('excerpt', { nullable: true });
    t.string('format', { nullable: true });
    t.string('image', { nullable: true });
    t.string('langage', { nullable: true });
    t.int('msrp', { nullable: true });
    t.string('overview', { nullable: true });
    t.int('pages', { nullable: true });
    t.string('publisher', { nullable: true });
    t.list.string('reviews', { nullable: true });
    t.list.string('subjects', { nullable: true });
    t.string('synopsys', { nullable: true });
    t.string('title_long', { nullable: true });
  },
});

export const isbnAuthor = queryField('isbnAuthor', {
  type: ISBNBookAPIType,
  list: true,
  args: {
    name: stringArg({ required: true }),
  },
  resolve(_, { name }): Promise<ISBNBook[]> {
    return fetchAuthor(name);
  },
});

export const isbnBooks = queryField('isbnBooks', {
  type: ISBNBookAPIType,
  list: true,
  args: {
    name: stringArg({ required: true }),
  },
  resolve(_, { name }): Promise<ISBNBook[]> {
    return fetchBooks(name);
  },
});
