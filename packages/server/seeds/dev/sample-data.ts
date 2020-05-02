/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/explicit-function-return-type */
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
  {
    id: 'c3f375b5-f5a3-4a01-8296-2805b4979eab',
    title: 'The Scarlet Letter',
    isbn10: '1234567',
    isbn13: '32432434234',
  },
];

const authors = [
  { id: 'd6b6a26e-dc9e-4583-9109-27cc55727dc0', name: 'Charles Dickens' },
  { id: 'd874295a-671e-43db-a16c-9580c1d5f28a', name: 'Nathaniel Hawthorne' },
];

const bookAuthors = [
  {
    author_id: 'd6b6a26e-dc9e-4583-9109-27cc55727dc0',
    book_id: '32f9b12b-023b-47bd-a06e-b62affaa8b3f',
  },
  {
    author_id: 'd874295a-671e-43db-a16c-9580c1d5f28a',
    book_id: 'c3f375b5-f5a3-4a01-8296-2805b4979eab',
  },
];

const usersBooks = [
  {
    id: '2583f1b4-7564-430d-9c3e-80699cafca38',
    isbn_book_id: '32f9b12b-023b-47bd-a06e-b62affaa8b3f',
    user_id: 'a6a7c4f4-40d5-41c8-9f6f-6ecbf053c31c',
    rating: 3,
  },
  {
    id: 'c5206512-b9af-4b4a-96a2-4102fa8b3480',
    isbn_book_id: 'c3f375b5-f5a3-4a01-8296-2805b4979eab',
    user_id: 'a6a7c4f4-40d5-41c8-9f6f-6ecbf053c31c',
    rating: 4,
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
  {
    id: 'fa81f4b7-5551-42c7-aad6-1896333ab9b1',
    user_book_id: 'c5206512-b9af-4b4a-96a2-4102fa8b3480',
    user_id: 'a6a7c4f4-40d5-41c8-9f6f-6ecbf053c31c',
    title: 'I love this book',
    notes:
      'This book is an excellent treatise on culture and life when religion dictates laws of societies',
  },
];

export async function seed(knex: Knex): Promise<void> {
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
