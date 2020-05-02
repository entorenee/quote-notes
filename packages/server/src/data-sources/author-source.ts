/* eslint-disable import/no-cycle */
import DataLoader from 'dataloader';

import { AuthorsEntity, BooksAuthorsEntity } from '../generated/db-types';
import { byColumnLoader, manyByColumnLoader } from '../utils/loader-utils';
import Context from './context';

class AuthorSource {
  protected ctx: Context;

  public constructor(ctx: Context) {
    this.ctx = ctx;
  }

  private authorIdsLoader = new DataLoader<string, BooksAuthorsEntity[]>(
    ids => {
      return manyByColumnLoader(this.ctx, 'booksAuthors', 'bookId', ids);
    },
  );

  private byIdLoader = new DataLoader<string, AuthorsEntity>(ids => {
    return byColumnLoader(this.ctx, 'authors', 'id', ids);
  });

  private async authorIds(bookId: string) {
    const result = await this.authorIdsLoader.load(bookId);
    return result.map(({ authorId }) => authorId);
  }

  /*
   * Method to return all authors whose name is in an array of values.
   * Used when creating new book entries in book-source
   */
  public authorsByName(
    authorNames: readonly AuthorsEntity['name'][],
  ): Promise<AuthorsEntity[]> {
    return this.ctx
      .knex<AuthorsEntity>('authors')
      .select('*')
      .whereIn('name', authorNames);
  }

  public byId(id: string) {
    return this.byIdLoader.load(id);
  }

  public async bookAuthors(bookId: string) {
    const authorIds = await this.authorIds(bookId);
    return this.byIdLoader.loadMany(authorIds);
  }

  public allAuthors(): Promise<AuthorsEntity[]> {
    return this.ctx.knex.from<AuthorsEntity>('authors').select('*');
  }
}

export default AuthorSource;
