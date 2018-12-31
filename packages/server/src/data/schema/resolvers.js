import mongoose from 'mongoose';

const User = mongoose.model('User');

const resolvers = {
  Query: {
    me: (_, args, { user }) => {
      if (user) {
        return User.findOne({ sub: user.sub });
      }

      return null;
    },
  },
  Mutation: {
    updateUser: (_, { user }) => {
      if (user) {
        return User.findOneAndUpdate({ sub: user.sub }, user, {
          upsert: true,
          new: true,
        });
      }

      return null;
    },
  },
};

export default resolvers;
