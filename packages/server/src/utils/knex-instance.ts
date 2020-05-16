import knex from 'knex';
import { camelizeKeys, decamelize } from 'humps';

import decrypt from './decrpyt';

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

let connectionUrl: string;

const knexInstance = async (): Promise<knex> => {
  const { DB_URL, KMS_ID } = process.env;
  if (!DB_URL) {
    return Promise.reject(new Error('Missing environment variable DB_URL'));
  }
  if (!KMS_ID) {
    return Promise.reject(new Error('Missing environment variable KMS_ID'));
  }

  if (!connectionUrl) {
    /* eslint-disable require-atomic-updates */
    connectionUrl = await decrypt(KMS_ID, DB_URL);
  }

  return knex({
    client: 'pg',
    connection: connectionUrl,
    wrapIdentifier,
    postProcessResponse,
  });
};

export default knexInstance;
