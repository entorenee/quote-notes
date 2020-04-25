import * as Knex from 'knex';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function up(knex: Knex): Promise<any> {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
    return knex.schema
      .createTable('users', table => {
        table
          .uuid('id')
          .primary()
          .notNullable()
          .defaultTo(knex.raw('uuid_generate_v4()'));
        table.timestamps(false, true);
        table.text('name');
        table.text('sub').notNullable();
      })
      .createTable('isbn_books', table => {
        table
          .uuid('id')
          .primary()
          .notNullable()
          .defaultTo(knex.raw('uuid_generate_v4()'));
        table.text('title').notNullable();
        table.text('isbn10').notNullable();
        table.text('isbn13').notNullable();
      })
      .createTable('user_books', table => {
        table
          .uuid('id')
          .primary()
          .notNullable()
          .defaultTo(knex.raw('uuid_generate_v4()'));
        table.timestamps(false, true);
        table.integer('rating').unsigned();
        table.text('synopsis');
        table.uuid('isbn_book_id').notNullable();
        table.uuid('user_id').notNullable();
        table
          .foreign('isbn_book_id')
          .references('id')
          .inTable('isbn_books');
        table
          .foreign('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
      })
      .createTable('authors', table => {
        table
          .uuid('id')
          .primary()
          .notNullable()
          .defaultTo(knex.raw('uuid_generate_v4()'));
        table.text('name').notNullable();
      })
      .createTable('books_authors', table => {
        table.uuid('book_id').notNullable();
        table.uuid('author_id').notNullable();
        table
          .foreign('book_id')
          .references('id')
          .inTable('isbn_books')
          .onDelete('CASCADE');
        table
          .foreign('author_id')
          .references('id')
          .inTable('authors')
          .onDelete('CASCADE');
        table.primary(['book_id', 'author_id']);
      })
      .createTable('entries', table => {
        table
          .uuid('id')
          .primary()
          .notNullable()
          .defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('user_book_id').notNullable();
        table.uuid('user_id').notNullable();
        table
          .foreign('user_book_id')
          .references('id')
          .inTable('user_books')
          .onDelete('CASCADE');
        table
          .foreign('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        table.timestamps(false, true);
        table.text('title').notNullable();
        table.text('notes');
        table.text('chapter');
        table.string('pages');
        table.text('quote');
      });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function down(knex: Knex): Promise<any> {
  // Order is important to delete tables which have dependents first
  return knex.schema
    .dropTable('books_authors')
    .dropTable('authors')
    .dropTable('entries')
    .dropTable('user_books')
    .dropTable('isbn_books')
    .dropTable('users');
}
