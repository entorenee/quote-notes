import knex from 'knex';
import { camelizeKeys, decamelize } from 'humps';

const identifierCache: Record<string, string> = {};

const wrapIdentifier = (value: string, originalImpl: Function): string => {
  return (
    identifierCache[value] ||
    (identifierCache[value] =
      value === '*' ? value : originalImpl(decamelize(value)))
  );
};

const postProcessResponse = (result: any) => {
  if (Array.isArray(result)) {
    return result.map(row => camelizeKeys(row));
  }
  return camelizeKeys(result);
};

const knexInstance = () =>
  knex({
    client: 'pg',
    connection: process.env.POSTGRESQL_URL,
    wrapIdentifier,
    postProcessResponse,
  });

export default knexInstance;
