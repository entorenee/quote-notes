import Entry from '../models/entry';
import { NullableUser, UserModel } from '../models/types';
import { updateFieldId } from '../user-methods';
import { MongooseRemoved } from '../../shared-types';

const removeBookFromUser = (
  bookId: string,
  user: UserModel,
): Promise<NullableUser> =>
  updateFieldId({
    objectId: user.id,
    operator: '$pull',
    field: 'books',
    value: bookId,
  });

const removeBookEntries = (
  bookId: string,
  user: UserModel,
): Promise<MongooseRemoved> =>
  Entry.deleteMany({ book: bookId, owner: user.id }).exec();

const removeMyBook = async (
  bookId: string,
  user: UserModel,
): Promise<NullableUser> => {
  if (!user) return null;

  const [userObj] = await Promise.all([
    removeBookFromUser(bookId, user),
    removeBookEntries(bookId, user),
  ]);

  return userObj;
};

export default removeMyBook;
