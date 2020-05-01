import { interfaceType, objectType, scalarType } from '@nexus/schema';
import { Kind } from 'graphql/language';

export const NodeType = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id', { description: 'Unique identifier for the resource' });
    t.resolveType(() => null);
  },
});

export const BookBase = interfaceType({
  name: 'BookBase',
  definition(t) {
    t.string('isbn', {
      description: 'A 10 digit ISBN',
    });
    t.string('isbn13', {
      description: 'A new format 13 digit ISBN',
    });
    t.string('title', {
      description: 'Title of the book',
    });
    t.resolveType(() => null);
  },
});

export const Timestamps = interfaceType({
  name: 'Timestamps',
  definition(t) {
    t.date('createdAt');
    t.date('updatedAt');
    t.resolveType(() => null);
  },
});

export const DateScalar = scalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  asNexusMethod: 'date',
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value.getTime(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value); // ast value is always in string format
    }
    return null;
  },
});

// Nexus requires a base Query to extend from. Logic for queries are with related types
export const Query = objectType({
  name: 'Query',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  definition() {},
});
