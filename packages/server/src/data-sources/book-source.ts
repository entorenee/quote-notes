/* eslint-disable import/no-cycle */
import DataLoader from 'dataloader';
import { QueryBuilder } from 'knex';
import { keyBy, uniq } from 'lodash';

import {
  AuthorsEntity,
  BooksAuthorsEntity,
  UserBooksEntity,
  IsbnBooksEntity,
} from '../generated/db-types';
import {
  byColumnLoader,
  orderLoaderResponse,
  orderManyLoaderResponse,
  manyByColumnLoader,
} from '../utils/loader-utils';
import { fetchBook } from '../services/isbn-api';
import Context from './context';

type UserJoinedBook = UserBooksEntity & IsbnBooksEntity;

class BookSource {
  protected ctx: Context;

  public constructor(ctx: Context) {
    this.ctx = ctx;
  }

  private userBookReturn: Extract<keyof UserBooksEntity, string>[] = [
    'id',
    'createdAt',
    'updatedAt',
    'rating',
    'synopsis',
    'isbnBookId',
    'userId',
  ];

  /*
   * Client doesn't need to care that ISBN and User book are on separate tables
   * Fetch a joined User book by id or all of a user's books\
   */
  private userBooksQuery(
    key: 'userId' | 'id',
    values: readonly string[],
  ): Promise<UserJoinedBook[]> {
    return this.ctx.knex
      .from('userBooks')
      .join('isbnBooks', 'userBooks.isbnBookId', '=', 'isbnBooks.id')
      .whereIn(`userBooks.${key}`, uniq(values))
      .select(
        'userBooks.*',
        'isbnBooks.title',
        'isbnBooks.isbn10',
        'isbnBooks.isbn13',
      );
  }

  // Used to get book ids from an author
  private bookIdsLoader = new DataLoader<string, BooksAuthorsEntity[]>(ids => {
    return manyByColumnLoader(this.ctx, 'booksAuthors', 'authorId', ids);
  });

  private isbnBookByIdLoader = new DataLoader<string, IsbnBooksEntity>(ids => {
    return byColumnLoader(this.ctx, 'isbnBooks', 'id', ids);
  });

  private async bookIds(authorId: string) {
    const result = await this.bookIdsLoader.load(authorId);
    return result.map(({ bookId }) => bookId);
  }

  private userBooksByBookIdLoader = new DataLoader<string, UserJoinedBook>(
    ids => {
      const key = 'id';
      return this.userBooksQuery(key, ids).then(books =>
        orderLoaderResponse('userBooks', key, ids, books),
      );
    },
  );

  private userBooksByUserIdLoader = new DataLoader<string, UserJoinedBook[]>(
    ids => {
      const key = 'userId';
      return this.userBooksQuery(key, ids).then(books =>
        orderManyLoaderResponse(key, ids, books),
      );
    },
  );

  private async insertUserBook({
    isbnBookId,
    userId,
  }: Pick<UserBooksEntity, 'isbnBookId' | 'userId'>): Promise<UserBooksEntity> {
    const [userBook] = await this.ctx
      .knex<UserBooksEntity>('userBooks')
      .insert({ isbnBookId, userId })
      .returning(this.userBookReturn);
    return userBook;
  }

  /*
   * Create a book from the ISBN API and store resulting records for:
   * isbnBooks: Local copy of respective ISBNDB fields
   * authors: Create new entries for any new authors
   * booksAuthors: Add respective foreign keys to join table
   */
  private async storeIsbnBookData(isbn: string): Promise<IsbnBooksEntity> {
    const book = await fetchBook(isbn);
    if (!book) {
      return Promise.reject(new Error(`No book found with ISBN: ${isbn}`));
    }
    const { authors, isbn: isbn10, isbn13, title } = book;
    try {
      /* eslint-disable @typescript-eslint/explicit-function-return-type */
      return this.ctx.knex.transaction(async trx => {
        const authorsPromise = this.ctx.author.authorsByName(authors);
        const isbnPromise: Promise<IsbnBooksEntity> = trx<IsbnBooksEntity>(
          'isbnBooks',
        )
          .insert({
            isbn10,
            isbn13,
            title,
          })
          .returning(['id', 'isbn10', 'isbn13', 'title']);
        const [authorRecords, isbnRecord] = await Promise.all([
          authorsPromise,
          isbnPromise,
        ]);
        /* eslint-enable @typescript-eslint/explicit-function-return-type */

        const authorDictionary = keyBy(authorRecords, 'name');
        const authorsToInsert = authors.filter(
          (author): boolean => !authorDictionary[author],
        );
        const newAuthorIds = await Promise.all(
          authorsToInsert.map(
            (name): QueryBuilder =>
              trx<AuthorsEntity>('authors')
                .insert({ name })
                .returning('id'),
          ),
        );

        const bookAuthorEntries = authorRecords
          .map(({ id }): AuthorsEntity['id'] => id)
          .concat(...newAuthorIds)
          .map(authorId => ({
            authorId,
            // @ts-ignore
            bookId: isbnRecord[0].id,
          }));
        await trx<BooksAuthorsEntity>('booksAuthors').insert(bookAuthorEntries);

        // @ts-ignore
        return isbnRecord[0];
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public userBooks(userId: string): Promise<UserJoinedBook[]> {
    return this.userBooksByUserIdLoader.load(userId);
  }

  // Helper method to load the current user's id
  public async currUserBooks(): Promise<UserJoinedBook[] | null> {
    const userId = await this.ctx.user.userId;
    return userId ? this.userBooks(userId) : Promise.resolve(null);
  }

  public userBookById(id: string): Promise<UserJoinedBook> {
    return this.userBooksByBookIdLoader.load(id);
  }

  public isbnBookById(id: string): Promise<IsbnBooksEntity> {
    return this.isbnBookByIdLoader.load(id);
  }

  public async booksWritten(authorId: string) {
    const bookIds = await this.bookIds(authorId);
    return this.isbnBookByIdLoader.loadMany(bookIds);
  }

  public async createUserBook(isbn: string): Promise<UserJoinedBook> {
    const userId = await this.ctx.user.userId;
    if (!userId) {
      return Promise.reject(
        new Error('You must be authenticated to create a user book'),
      );
    }

    // Check if the book already lives in the database
    let [isbnBook] = await this.ctx
      .knex<IsbnBooksEntity>('isbnBooks')
      .select('*')
      .where('isbn10', isbn)
      .orWhere('isbn13', isbn);

    if (!isbnBook) {
      isbnBook = await this.storeIsbnBookData(isbn);
    }

    const { id: isbnBookId, ...bookData } = isbnBook;
    const userBook = await this.insertUserBook({ isbnBookId, userId });
    const data = { ...userBook, ...bookData };
    return Promise.resolve(data);
  }

  public async deleteUserBook(
    id: string,
  ): Promise<Pick<UserBooksEntity, 'id'>> {
    const userId = await this.ctx.user.userId;
    if (!userId) {
      return Promise.reject(
        new Error('You must be authenticated to delete a user book'),
      );
    }
    return this.ctx
      .knex<UserBooksEntity>('userBooks')
      .where({ userId, id })
      .del()
      .returning(['id']);
  }
}

export default BookSource;
