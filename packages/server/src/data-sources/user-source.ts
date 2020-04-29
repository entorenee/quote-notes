/* eslint-disable import/no-cycle */
import DataLoader from 'dataloader';

import { UsersEntity } from '../generated/db-types';
import { byColumnLoader } from '../utils/loader-utils';
import Context from './context';

class UserSource {
  protected ctx: Context;

  public constructor(ctx: Context) {
    this.ctx = ctx;
  }

  private bySubLoader = new DataLoader<string, UsersEntity>(ids => {
    return byColumnLoader(this.ctx, 'users', 'sub', ids);
  });

  private byIdLoader = new DataLoader<string, UsersEntity>(ids => {
    return byColumnLoader(this.ctx, 'users', 'id', ids);
  });

  public currentUser(): Promise<UsersEntity | null> {
    return this.ctx.userSub
      ? this.bySubLoader.load(this.ctx.userSub)
      : Promise.resolve(null);
  }

  public byId(id: string): Promise<UsersEntity> {
    return this.byIdLoader.load(id);
  }

  public get userId(): Promise<string | null> {
    return this.currentUser().then(user => (user ? user.id : null));
  }
}

export default UserSource;
