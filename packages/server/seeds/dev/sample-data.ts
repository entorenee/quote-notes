/* eslint-disable @typescript-eslint/camelcase */
import * as Knex from 'knex';

const users = [
  {
    id: 'a6a7c4f4-40d5-41c8-9f6f-6ecbf053c31c',
    name: 'John Doe',
    sub: 'oAuth:sample',
  },
];

const isbnBooks = [
  {
    id: '32f9b12b-023b-47bd-a06e-b62affaa8b3f',
    title: 'Great Expectations',
    isbn10: '1234',
    isbn13: '324324',
  },
];

const authors = [
  { id: 'd6b6a26e-dc9e-4583-9109-27cc55727dc0', name: 'Charles Dickens' },
];

const bookAuthors = [
  {
    author_id: 'd6b6a26e-dc9e-4583-9109-27cc55727dc0',
    book_id: '32f9b12b-023b-47bd-a06e-b62affaa8b3f',
  },
];

const usersBooks = [
  {
    id: '2583f1b4-7564-430d-9c3e-80699cafca38',
    isbn_book_id: '32f9b12b-023b-47bd-a06e-b62affaa8b3f',
    user_id: 'a6a7c4f4-40d5-41c8-9f6f-6ecbf053c31c',
    rating: 3,
  },
];

const entries = [
  {
    id: '89a9fca6-1ca8-4ac0-9f12-56b8d695e973',
    user_book_id: '2583f1b4-7564-430d-9c3e-80699cafca38',
    user_id: 'a6a7c4f4-40d5-41c8-9f6f-6ecbf053c31c',
    title: 'My first note',
    notes: 'Here are some sample notes on a book. \n This book is tolerable',
  },
];

export async function seed(knex: Knex): Promise<any> {
  await knex('users')
    .del()
    .then(() => {
      return knex('users').insert(users);
    });

  await knex('isbn_books')
    .del()
    .then(() => {
      return knex('isbn_books').insert(isbnBooks);
    });

  await knex('authors')
    .del()
    .then(() => {
      return knex('authors').insert(authors);
    });

  await knex('books_authors')
    .del()
    .then(() => {
      return knex('books_authors').insert(bookAuthors);
    });

  await knex('user_books')
    .del()
    .then(() => {
      return knex('user_books').insert(usersBooks);
    });

  await knex('entries')
    .del()
    .then(() => {
      return knex('entries').insert(entries);
    });
}
