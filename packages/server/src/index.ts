/*tslint:disable no-var-requires */
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import mongoose from 'mongoose';

import './data/models/author';
import './data/models/book';
import './data/models/entry';
import './data/models/user';

dotenv.config();

const { AUTH0_DOMAIN, DB_URL } = process.env;
const User = mongoose.model('User');

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

const server = new ApolloServer({
  modules: [
    require('./data/schema/users'),
    require('./data/schema/entries'),
    require('./data/schema/authors'),
    require('./data/schema/books'),
    require('./data/schema/isbn'),
  ],
  context: ({ req }: any) => {
    return { user: req.user };
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
