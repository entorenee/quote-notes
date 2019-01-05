import mongoose from 'mongoose';
import { User } from './models/user';

const User = mongoose.model('User');

enum SetOps {
  push = '$push',
  pull = '$pull',
}

interface UpdateField {
  objectId: string;
  field: string;
  operator: '$push' | '$pull';
  value: string;
}

export const updateFieldId = (updater: UpdateField): any => {
  const { objectId, field, operator, value } = updater;

  return User.findByIdAndUpdate(
    objectId,
    { [operator]: { [field]: value } },
    { new: true },
  );
};
