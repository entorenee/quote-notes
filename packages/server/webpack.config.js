/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
// Package is installed via serverless-webpack
// eslint-disable-next-line import/no-extraneous-dependencies
const { NormalModuleReplacementPlugin } = require('webpack');

const { isLocal } = slsw.lib.webpack;

module.exports = {
  mode: isLocal ? 'development' : 'production',
  devtool: isLocal ? 'eval' : 'source-map',
  entry: slsw.lib.entries,
  output: {
    libraryTarget: 'commonjs2',
    filename: '[name].js',
    path: path.join(__dirname, '.webpack'),
  },
  externals: [nodeExternals(), 'aws-sdk', 'prettier'],
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
  plugins: [
    // Ignore knex dynamic required dialects that we don't use
    new NormalModuleReplacementPlugin(
      /m[sy]sql2?|oracle(db)?|sqlite3|pg-(native|query)/,
      'noop2',
    ),
  ],
};
