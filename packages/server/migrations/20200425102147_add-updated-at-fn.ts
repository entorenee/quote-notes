import * as Knex from 'knex';

const addTrigger = (tableName: string): string => `
  CREATE TRIGGER update_timestamp
  BEFORE UPDATE
  ON ${tableName}
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();
`;

const dropTrigger = (tableName: string): string => `
    DROP TRIGGER IF EXISTS update_timestamp
    ON ${tableName};
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(knex: Knex): Promise<any> {
  await knex.raw(addTrigger('users'));
  await knex.raw(addTrigger('user_books'));
  await knex.raw(addTrigger('entries'));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(knex: Knex): Promise<any> {
  await knex.raw(dropTrigger('users'));
  await knex.raw(dropTrigger('user_books'));
  await knex.raw(dropTrigger('entries'));
}
