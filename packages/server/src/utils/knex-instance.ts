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

/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postProcessResponse = (result: any) => {
  if (Array.isArray(result)) {
    return result.map(row => camelizeKeys(row));
  }
  return camelizeKeys(result);
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */

const knexInstance = (): knex =>
  knex({
    client: 'pg',
    connection: process.env.POSTGRESQL_URL,
    wrapIdentifier,
    postProcessResponse,
  });

export default knexInstance;
