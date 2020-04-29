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
      return manyByColumnLoader(this.ctx, 'booksAuthors', 'authorId', ids);
    },
  );

  private byIdLoader = new DataLoader<string, AuthorsEntity>(ids => {
    return byColumnLoader(this.ctx, 'authors', 'id', ids);
  });

  private async authorIds(bookId: string) {
    const result = await this.authorIdsLoader.load(bookId);
    return result.map(({ authorId }) => authorId);
  }

  public async authors(bookId: string) {
    const authorIds = await this.authorIds(bookId);
    return this.byIdLoader.loadMany(authorIds);
  }
}

export default AuthorSource;
