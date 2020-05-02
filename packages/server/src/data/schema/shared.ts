import { interfaceType, objectType, scalarType } from '@nexus/schema';
import { Kind } from 'graphql/language';

import { IsbnBooksEntity, UserBooksEntity } from '../../generated/db-types';

export type UserJoinedBook = IsbnBooksEntity & UserBooksEntity;

export const NodeType = interfaceType({
  name: 'Node',
  definition(t): void {
    t.id('id', { description: 'Unique identifier for the resource' });
    t.resolveType((): null => null);
  },
});

export const BookBase = interfaceType({
  name: 'BookBase',
  definition(t): void {
    t.string('isbn10', {
      description: 'A 10 digit ISBN',
    });
    t.string('isbn13', {
      description: 'A new format 13 digit ISBN',
      nullable: true,
    });
    t.string('title', {
      description: 'Title of the book',
    });
    t.resolveType((): null => null);
  },
});

export const Timestamps = interfaceType({
  name: 'Timestamps',
  definition(t): void {
    t.date('createdAt');
    t.date('updatedAt');
    t.resolveType((): null => null);
  },
});

export const DateScalar = scalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  asNexusMethod: 'date',
  parseValue(value): Date {
    return new Date(value); // value from the client
  },
  serialize(value): number {
    return value.getTime(); // value sent to the client
  },
  parseLiteral(ast): Date | null {
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
  definition(): void {},
});
