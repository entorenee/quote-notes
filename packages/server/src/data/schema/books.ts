/* eslint @typescript-eslint/ban-ts-ignore: "warn" */
import {
  idArg,
  mutationField,
  objectType,
  stringArg,
  queryField,
} from '@nexus/schema';

import {
  AuthorModel,
  BookModel,
  EntryModel,
  NullableBook,
  NullableUser,
} from '../models/types';
import addToMyBooksFn from '../controllers/add-to-my-books';
import removeMyBookFn from '../controllers/remove-my-book';
import { BookBase, NodeType, Timestamps } from './shared';

export const ISBNBookDBType = objectType({
  name: 'ISBNDatabaseBook',
  description: 'A stored subset of fields from the ISBN API for a given book',
  definition(t) {
    t.implements(NodeType);
    t.implements(BookBase);
  },
});

export const UserBook = objectType({
  name: 'UserBook',
  description:
    'An augmented ISBN Book, with additional user controlled properties',
  definition(t) {
    t.implements(BookBase, NodeType, Timestamps);
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
      // @ts-ignore
      resolve({ authors }, _, { db }): Promise<AuthorModel[]> {
        return db.Author.find({
          _id: { $in: authors },
        }).exec();
      },
    });
    t.list.field('entries', {
      type: 'Entry',
      description: `A user's entries on the given Book`,
      resolve({ id }, args, { db, user }): Promise<EntryModel[]> {
        return db.Entry.find({ book: id, owner: user.id }).exec();
      },
    });
  },
});

export const allBooks = queryField('allBooks', {
  type: UserBook,
  nullable: true,
  list: true,
  resolve(_, __, { db }): Promise<BookModel[]> {
    return db.Book.find({}).exec();
  },
});

export const book = queryField('book', {
  type: UserBook,
  nullable: true,
  args: {
    id: stringArg({ required: true }),
  },
  resolve(_, { id }, { db }): Promise<NullableBook> {
    return db.Book.findById(id).exec();
  },
});

export const addToMyBooks = mutationField('addToMyBooks', {
  type: UserBook,
  nullable: true,
  args: {
    isbn: stringArg({ required: true }),
  },
  resolve(_, { isbn }, { user }): Promise<NullableBook> {
    return addToMyBooksFn(isbn, user);
  },
});

export const removeMyBook = mutationField('removeMyBook', {
  type: 'User',
  nullable: true,
  args: {
    id: idArg({ required: true }),
  },
  resolve(_, { id }, { user }): Promise<NullableUser> {
    return removeMyBookFn(id, user);
  },
});
