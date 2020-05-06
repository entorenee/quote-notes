/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: path.join(__dirname, '.webpack'),
  },
  externals: ['knex', 'pg'],
  target: 'node',
  resolve: {
    extensions: ['.js', '.mjs', '.cjs', '.json', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        include: __dirname,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto', // Necessary for properly resolving mjs
      },
    ],
  },
};
