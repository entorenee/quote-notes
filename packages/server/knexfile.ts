import { config } from 'dotenv';

config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.POSTGRESQL_URL,
    migrations: {
      extension: 'ts',
    },
    seeds: {
      directory: './seeds/dev',
    },
  },
};
