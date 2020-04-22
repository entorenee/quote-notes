import path from 'path';

import { ApolloServer } from 'apollo-server-express';
import { makeSchema } from '@nexus/schema';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import mongoose from 'mongoose';

import * as types from './data/schema';
import Author from './data/models/author';
import Book from './data/models/book';
import Entry from './data/models/entry';
import User from './data/models/user';

dotenv.config();

const { AUTH0_DOMAIN, DB_URL } = process.env;

mongoose.set('useFindAndModify', false);
mongoose.connect(DB_URL as string, { useNewUrlParser: true });

const checkJwt = jwt({
  algorithms: ['RS256'],
  credentialsRequired: false,
  issuer: `https://${AUTH0_DOMAIN}/`,
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
    rateLimit: true,
  }),
});

const fetchUserId = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.sub) return next();

  const user = await User.findOne({ sub: req.user.sub });

  if (user) {
    const { id } = user;
    // eslint-disable-next-line require-atomic-updates
    req.user = {
      ...req.user,
      id,
    };
  }
  return next();
};

const app = express();
app.use('*', checkJwt, fetchUserId);

const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, 'generated-schema.graphql'),
    typegen: path.join(__dirname, 'nexus-types.gen.ts'),
  },
});

const server = new ApolloServer({
  schema,
  context: ({ req }: any) => {
    return {
      db: {
        Author,
        Book,
        Entry,
        User,
      },
      user: req.user,
    };
  },
});
server.applyMiddleware({ app });

const port = 3000;

app.listen({ port }, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
  );
});
