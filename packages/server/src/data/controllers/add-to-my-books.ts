import Author from '../models/author';
import Book from '../models/book';
import { NullableBook, NullableUser, UserModel } from '../models/types';
import { fetchBook } from '../../services/isbn-api';
import { ISBNBook } from '../../services/types';
import { updateFieldId } from '../user-methods';

const addBookToAuthors = async (
  authors: string[],
  bookId: string,
): Promise<string[]> => {
  const newDocs = await Author.updateMany(
    { name: { $in: authors } },
    { $push: { booksWritten: bookId } },
    { upsert: true },
  );

  return newDocs.upserted.map(({ _id }: { _id: string }) => _id);
};

const addBookToUser = (userId: string, bookId: string): Promise<NullableUser> =>
  updateFieldId({
    objectId: userId,
    field: 'books',
    operator: '$push',
    value: bookId,
  });

const addToMyBooks = async (
  isbn: string,
  user: UserModel,
): Promise<NullableBook> => {
  if (!user) return null;

  const existingBook = await Book.findOne({ isbn }).exec();
  if (existingBook) {
    await addBookToUser(user.id, existingBook.id);
    return existingBook;
  }

  const isbnBook: ISBNBook = await fetchBook(isbn);

  const {
    authors,
    isbn13,
    date_published: publishedDate,
    synopsys: synopsis,
    title,
  } = isbnBook;

  // Create Book Entry
  const bookData = {
    isbn: isbn13,
    publishedDate,
    synopsis,
    title,
  };

  const bookEntry = new Book(bookData);
  const { id: bookId } = bookEntry;

  // Update/Create Authors and save book
  const authorIds = await addBookToAuthors(authors, bookEntry.id);
  bookEntry.authors = authorIds;
  const [newBook] = await Promise.all([
    bookEntry.save(),
    addBookToUser(user.id, bookId),
  ]);

  return newBook;
};

export default addToMyBooks;
