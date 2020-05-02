import { keyBy, groupBy, Dictionary, uniq } from 'lodash';

// eslint-disable-next-line import/no-cycle
import Context from '../data-sources/context';
import { DbTables } from '../generated/db-types';

export const orderLoaderResponse = <Data>(
  table: string,
  key: string,
  keys: readonly (string | number)[],
  rows: Data[],
): (Data | Error)[] => {
  const normalized: Dictionary<Data> = keyBy(rows, key);
  return keys.map(
    (keyVal): Data | Error =>
      normalized[keyVal] ||
      new Error(`Missing row data for ${table}:${key} ${keyVal}`),
  );
};

export const orderManyLoaderResponse = <Data>(
  key: string,
  keys: readonly (string | number)[],
  rows: Data[],
): Data[][] => {
  const grouped = groupBy(rows, key);
  return keys.map((id): Data[] => grouped[id] || []);
};

export const byColumnLoader = <
  Tbl extends keyof DbTables,
  Key extends Extract<keyof DbTables[Tbl], string>,
  KeyType extends Extract<DbTables[Tbl][Key], string | number>
>(
  ctx: Context,
  table: Tbl,
  key: Key,
  values: readonly KeyType[],
): PromiseLike<DbTables[Tbl][]> => {
  return (
    ctx.knex
      .select('*')
      .from(table)
      .whereIn(key, values)
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      .then(rows => orderLoaderResponse(table, key, values, rows))
  );
};

export function manyByColumnLoader<
  Tbl extends keyof DbTables,
  Key extends Extract<keyof DbTables[Tbl], string>,
  KeyType extends Extract<DbTables[Tbl][Key], string | number>
>(
  ctx: Context,
  tableName: Tbl,
  key: Key,
  keys: readonly KeyType[],
): PromiseLike<DbTables[Tbl][][]> {
  return ctx
    .knex(tableName)
    .select(`${tableName}.*`)
    .whereIn(`${tableName}.${key}`, uniq(keys))
    .then((rows): DbTables[Tbl][][] => {
      return orderManyLoaderResponse(key, keys, rows);
    });
}
