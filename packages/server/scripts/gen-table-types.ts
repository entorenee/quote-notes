/* eslint-disable import/no-extraneous-dependencies, no-console */
import path from 'path';
import fs from 'fs';

import dotenv from 'dotenv';
import knex from 'knex';
import { format } from 'prettier';
import { pascalize } from 'humps';
import sqlts, { Config } from '@rmp135/sql-ts';

dotenv.config();

const GENERATED_DIR = path.join(__dirname, '../src/generated');
const DB_TYPES = path.join(GENERATED_DIR, 'db-types.ts');

const { POSTGRESQL_URL: connectionStr } = process.env;

const dbConfig: Config = {
  client: 'pg',
  connection: connectionStr,
  excludedTables: ['public.knex_migrations', 'public.knex_migrations_lock'],
  tableNameCasing: 'pascal',
  columnNameCasing: 'camel',
  template: path.join(__dirname, 'table-type-template.handlebars'),
  typeMap: {
    // Convert ISO Timestamp types to TS strings
    string: ['timestamp', 'timestamptz'],
  },
};

const generateTypes = async (): Promise<void> => {
  const db = knex({
    client: 'pg',
    connection: connectionStr,
  });
  const rows = await db
    .select('table_name')
    .from('information_schema.tables')
    .where('table_schema', 'public');
  const tables = rows
    .map(({ table_name: name }): string => `'${pascalize(name)}'`)
    .filter((table): boolean => !table.includes('Knex'))
    .sort()
    .join(' | ');
  db.destroy();

  const definitions = await sqlts.toObject(dbConfig);
  const tsString = sqlts.fromObject(definitions, dbConfig);

  fs.writeFileSync(
    DB_TYPES,
    format(
      `
    ${tsString}

    export type DbTables = ${tables}
    `,
      { parser: 'typescript', singleQuote: true },
    ),
  );
};

generateTypes()
  .then((): void => {
    console.log('Database types successfully generated');
  })
  .catch((err): void => {
    throw err;
  });
