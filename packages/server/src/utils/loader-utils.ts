import { keyBy, Dictionary } from 'lodash';

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
