import { Document } from 'mongoose';

type Optional<T> = T | null;

export interface AuthorModel extends Document {
  id: string;
  booksWritten: BookModel['_id'];
  name: string;
}

export interface BookModel extends Document {
  id: string;
  authors: AuthorModel['_id'];
  isbn: string;
  publishedDate?: Date;
  synopsis?: string;
  title: string;
}

export interface EntryModel extends Document {
  id: string;
  book: BookModel['_id'];
  chapter: string;
  createdAt: Date;
  notes: string;
  owner: UserModel['_id'];
  page: number;
  quote: string;
}

export interface UserModel extends Document {
  id: string;
  books: BookModel['_id'];
  createdAt: Date;
  entries: EntryModel['_id'];
  name?: string;
  picture?: string;
  sub: string;
}

export type NullableAuthor = Optional<AuthorModel>;
export type NullableBook = Optional<BookModel>;
export type NullableEntry = Optional<EntryModel>;
export type NullableUser = Optional<UserModel>;

