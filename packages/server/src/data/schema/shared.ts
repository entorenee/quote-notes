import { interfaceType, objectType, scalarType } from '@nexus/schema';
import { Kind } from 'graphql/language';

export const NodeType = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id', { description: 'Unique identifier for the resource' });
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
  definition() {},
});
