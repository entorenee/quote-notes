import path from 'path';

import { ApolloServer } from 'apollo-server-express';
import { makeSchema } from '@nexus/schema';
import dotenv from 'dotenv';
import express, { Request } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import knex from './utils/knex-instance';
import Context from './data-sources/context';

import * as types from './data/schema';

dotenv.config();

const { AUTH0_DOMAIN } = process.env;

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

const app = express();
app.use('*', checkJwt);

const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, 'generated/generated-schema.graphql'),
    typegen: path.join(__dirname, 'generated/nexus-types.gen.ts'),
  },
});

const server = new ApolloServer({
  schema,
  context: ({ req }: { req: Request }): Context => {
    return new Context(knex(), req.user && req.user.sub);
  },
});
server.applyMiddleware({ app });

const port = 3000;

app.listen({ port }, (): void => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
  );
});
