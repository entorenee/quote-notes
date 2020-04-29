import { keyBy, groupBy, Dictionary, uniq } from 'lodash';
import { QueryBuilder } from 'knex';

// eslint-disable-next-line import/no-cycle
import Context from '../data-sources/context';
import { DbTables } from '../generated/db-types';

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
  return ctx.knex
    .select('*')
    .from(table)
    .whereIn(key, values)
    .then(rows => {
      const normalized: Dictionary<DbTables[Tbl]> = keyBy(rows, key);
      return values.map(
        keyVal =>
          normalized[keyVal] ||
          new Error(`Missing row data for ${table}:${key} ${keyVal}`),
      );
    });
};

/**
 * A type-safe loader for loading many of a particular item,
 * grouped by an individual key.
 * @param ctx
 * @param table
 * @param key
 * @param keys
 */
export function manyByColumnLoader<
  Tbl extends keyof DbTables,
  Key extends Extract<keyof DbTables[Tbl], string>,
  KeyType extends Extract<DbTables[Tbl][Key], string | number>
>(
  ctx: Context,
  tableName: Tbl,
  key: Key,
  keys: readonly KeyType[],
  scope: (qb: QueryBuilder) => QueryBuilder = qb => qb,
) {
  const builder = ctx
    .knex(tableName)
    .select(`${tableName}.*`)
    .whereIn(`${tableName}.${key}`, uniq(keys));
  return scope(builder).then((rows: DbTables[Tbl][]) => {
    const grouped = groupBy(rows, key);
    return keys.map(id => grouped[id] || []);
  });
}
