import fetch from 'node-fetch';

import { ISBNBook, RawAuthorResponse, RawAuthorsResponse } from './types';

const BASE_URL = 'https://api2.isbndb.com';

const fetchIsbn = async (url: string) => {
  const { ISBN_AUTH } = process.env;
  const response = await fetch(`${BASE_URL}/${url}`, {
    method: 'GET',
    headers: {
      Authorization: ISBN_AUTH as string,
    },
  });
  return response.json();
};

export const fetchBooks = (book: string): Promise<ISBNBook[]> =>
  fetchIsbn(`books/${book}`).then(data => data.books);

export const fetchBook = (isbn: string): Promise<ISBNBook> =>
  fetchIsbn(`book/${isbn}`).then(data => data.book);

export const fetchAuthors = (author: string): Promise<RawAuthorsResponse> =>
  fetchIsbn(`authors/${author}`);

export const fetchAuthor = (author: string): Promise<ISBNBook[]> =>
  fetchIsbn(`author/${author}`).then(data => data.books);
