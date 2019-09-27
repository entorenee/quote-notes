/* eslint-disable @typescript-eslint/interface-name-prefix */

export interface ISBNBook {
  authors: string[];
  date_published: string;
  dewey_decimal?: string;
  dimensions?: string;
  edition?: string;
  excerpt?: string;
  format?: string;
  image: string;
  isbn: string;
  isbn13: string;
  language?: string;
  msrp?: number;
  overview?: string;
  pages?: number;
  publisher?: string;
  reviews?: string[];
  subjects?: string[];
  synopsys?: string;
  title: string;
  title_long: string;
}

export interface RawBooksResponse {
  total: number;
  books: ISBNBook[];
}

export interface RawAuthorsResponse {
  authors: string[];
}

export interface RawAuthorResponse {
  author: string;
  books: ISBNBook[];
}
