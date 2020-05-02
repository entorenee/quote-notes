import * as Knex from 'knex';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function up(knex: Knex): Promise<any> {
  return knex.raw(`
    CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$;
  `);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function down(knex: Knex): Promise<any> {
  return knex.raw(`
    DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
  `);
}
