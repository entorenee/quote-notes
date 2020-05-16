import fetch from 'node-fetch';

import decrypt from '../utils/decrpyt';
import { ISBNBook, RawAuthorsResponse } from './types';

const BASE_URL = 'https://api2.isbndb.com';

let isbnAuth: string;

const fetchIsbn = async (url: string) => {
  const { ISBN_AUTH, KMS_ID } = process.env;
  if (!ISBN_AUTH) {
    return Promise.reject(new Error('Missing environment variable ISBN_AUTH'));
  }
  if (!KMS_ID) {
    return Promise.reject(new Error('Missing environment variable KMS_ID'));
  }
  if (!isbnAuth) {
    /* eslint-disable require-atomic-updates */
    isbnAuth = await decrypt(KMS_ID, ISBN_AUTH);
  }
  const response = await fetch(`${BASE_URL}/${url}`, {
    method: 'GET',
    headers: {
      Authorization: isbnAuth,
    },
  });
  return response.json();
};

export const fetchBooks = (book: string): Promise<ISBNBook[]> =>
  fetchIsbn(`books/${book}`).then((data): ISBNBook[] => data.books);

export const fetchBook = (isbn: string): Promise<ISBNBook> =>
  fetchIsbn(`book/${isbn}`).then((data): ISBNBook => data.book);

export const fetchAuthors = (author: string): Promise<RawAuthorsResponse> =>
  fetchIsbn(`authors/${author}`);

export const fetchAuthor = (author: string): Promise<ISBNBook[]> =>
  fetchIsbn(`author/${author}`).then((data): ISBNBook[] => data.books);
