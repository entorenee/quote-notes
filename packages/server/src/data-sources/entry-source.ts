/* eslint-disable import/no-cycle */
import DataLoader from 'dataloader';

import { EntriesEntity } from '../generated/db-types';
import { byColumnLoader, manyByColumnLoader } from '../utils/loader-utils';
import Context from './context';

class EntrySource {
  protected ctx: Context;

  public constructor(ctx: Context) {
    this.ctx = ctx;
  }

  private byIdLoader = new DataLoader<string, EntriesEntity>(ids => {
    return byColumnLoader(this.ctx, 'entries', 'id', ids);
  });

  private byBookIdLoader = new DataLoader<string, EntriesEntity[]>(ids => {
    // @ts-ignore
    return manyByColumnLoader(this.ctx, 'entries', 'user_book_id', ids);
  });

  public byId(id: string): Promise<EntriesEntity> {
    return this.byIdLoader.load(id);
  }

  public byBookId(id: string): Promise<EntriesEntity[]> {
    return this.byBookIdLoader.load(id);
  }
}

export default EntrySource;
