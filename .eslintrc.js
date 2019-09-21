module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'dslemay',
    'dslemay/react',
    'dslemay/jest',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
};
