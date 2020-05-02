import { config } from 'dotenv';

config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DB_URL,
    migrations: {
      extension: 'ts',
    },
    seeds: {
      directory: './seeds/dev',
    },
  },
};
