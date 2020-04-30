/* eslint-disable import/no-cycle */
import DataLoader from 'dataloader';
import { uniq } from 'lodash';

import {
  BooksAuthorsEntity,
  UserBooksEntity,
  IsbnBooksEntity,
} from '../generated/db-types';
import {
  byColumnLoader,
  orderManyLoaderResponse,
  manyByColumnLoader,
} from '../utils/loader-utils';
import Context from './context';

type UserJoinedBook = UserBooksEntity & IsbnBooksEntity;

class BookSource {
  protected ctx: Context;

  public constructor(ctx: Context) {
    this.ctx = ctx;
  }

  /*
   * Client doesn't need to care that ISBN and User book are on separate tables
   * Fetch a joined User book by id or all of a user's books\
   */
  private userBooksQuery(
    key: 'userId' | 'id',
    values: readonly string[],
  ): Promise<UserJoinedBook[][]> {
    return this.ctx.knex
      .from('userBooks')
      .join('isbnBooks', 'userBooks.isbnBookId', '=', 'isbnBooks.id')
      .whereIn(key, uniq(values))
      .select(
        'userBooks.*',
        'isbnBooks.title',
        'isbnBooks.isbn10',
        'isbnBooks.isbn13',
      )
      .then(books => orderManyLoaderResponse(key, values, books));
  }

  // Used to get book ids from an author
  private bookIdsLoader = new DataLoader<string, BooksAuthorsEntity[]>(ids => {
    return manyByColumnLoader(this.ctx, 'booksAuthors', 'bookId', ids);
  });

  private isbnBookByIdLoader = new DataLoader<string, IsbnBooksEntity>(ids => {
    return byColumnLoader(this.ctx, 'isbnBooks', 'id', ids);
  });

  private async bookIds(authorId: string) {
    const result = await this.bookIdsLoader.load(authorId);
    return result.map(({ bookId }) => bookId);
  }

  private userBooksByBookIdLoader = new DataLoader<string, UserJoinedBook[]>(
    ids => {
      return this.userBooksQuery('id', ids);
    },
  );

  private userBooksByUserIdLoader = new DataLoader<string, UserJoinedBook[]>(
    ids => {
      return this.userBooksQuery('userId', ids);
    },
  );

  public userBooks(userId: string): Promise<UserJoinedBook[]> {
    return this.userBooksByUserIdLoader.load(userId);
  }

  // Helper method to load the current user's id
  public async currUserBooks(): Promise<UserJoinedBook[] | null> {
    const userId = await this.ctx.user.userId;
    return userId ? this.userBooks(userId) : Promise.resolve(null);
  }

  public userBookById(id: string): Promise<UserJoinedBook[]> {
    return this.userBooksByBookIdLoader.load(id);
  }

  public isbnBookById(id: string): Promise<IsbnBooksEntity> {
    return this.isbnBookByIdLoader.load(id);
  }

  public async booksWritten(authorId: string) {
    const bookIds = await this.bookIds(authorId);
    return this.isbnBookByIdLoader.loadMany(bookIds);
  }
}

export default BookSource;
