/* eslint-disable import/no-cycle */
import Knex from 'knex';

import AuthorSource from './author-source';
import BookSource from './book-source';
import EntrySource from './entry-source';
import UserSource from './user-source';

class Context {
  public knex: Knex;

  public userSub: string | null;

  public constructor(knex: Knex, userSub?: string) {
    this.knex = knex;
    this.userSub = userSub || null;
  }

  public author = new AuthorSource(this);

  public entry = new EntrySource(this);

  public book = new BookSource(this);

  public user = new UserSource(this);
}

export default Context;
