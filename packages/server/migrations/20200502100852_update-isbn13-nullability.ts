/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as Knex from 'knex';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('isbn_books', table => {
    table.text('isbn13').alter();
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('isbn_books', table => {
    table
      .text('isbn13')
      .notNullable()
      .alter();
  });
}
