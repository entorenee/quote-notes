import knex from 'knex';
import { decamelize } from 'humps';

const identifierCache: Record<string, string> = {};

const wrapIdentifier = (value: string, originalImpl: Function): string => {
  return (
    identifierCache[value] ||
    (identifierCache[value] =
      value === '*' ? value : originalImpl(decamelize(value)))
  );
};

const knexInstance = () =>
  knex({
    client: 'pg',
    connection: process.env.POSTGRESQL_URL,
    wrapIdentifier,
  });

export default knexInstance;
