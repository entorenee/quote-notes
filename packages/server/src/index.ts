import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import mongoose from 'mongoose';

require('dotenv').config();
require('./data/models/user');
import { typeDefs } from './data/schema/schema';
import resolvers from './data/schema/resolvers';

const { AUTH0_DOMAIN, DB_URL } = process.env;

mongoose.set('useFindAndModify', false);
mongoose.connect(
  DB_URL as string,
  { useNewUrlParser: true },
);

const checkJwt = jwt({
  credentialsRequired: false,
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

const app = express();
app.use('*', checkJwt);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }: any) => {
    return { user: req.user };
  },
});
server.applyMiddleware({ app });

const port = 3000;

app.listen({ port }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
  );
});
