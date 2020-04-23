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
import { NodeType } from './shared';

export const Book = objectType({
  name: 'Book',
  definition(t) {
    t.implements(NodeType);
    t.string('isbn', {
      description: 'ISBN number of the book',
      nullable: true,
    });
    t.date('publishedDate', {
      description: 'Date of first publication',
      nullable: true,
    });
    t.string('synopsis', {
      description: 'Synopsis of the book',
      nullable: true,
    });
    t.string('title', {
      description: 'Title of the Book',
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
  type: Book,
  nullable: true,
  list: true,
  resolve(_, __, { db }): Promise<BookModel[]> {
    return db.Book.find({}).exec();
  },
});

export const book = queryField('book', {
  type: Book,
  nullable: true,
  args: {
    id: stringArg({ required: true }),
  },
  resolve(_, { id }, { db }): Promise<NullableBook> {
    return db.Book.findById(id).exec();
  },
});

export const addToMyBooks = mutationField('addToMyBooks', {
  type: Book,
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
