import path from 'path';

import { ApolloServer } from 'apollo-server-lambda';
import { makeSchema } from '@nexus/schema';

import knex from './utils/knex-instance';
import Context from './data-sources/context';

import * as types from './data/schema';

const schema = makeSchema({
  types,
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  outputs: {
    schema: path.join(__dirname, 'generated/generated-schema.graphql'),
    typegen: path.join(__dirname, 'generated/nexus-types.gen.ts'),
  },
});

const server = new ApolloServer({
  schema,
  context: async ({ event }): Promise<Context> => {
    const db = await knex();
    return new Context(db, event.requestContext.authorizer.principalId);
  },
});

export const handler = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
