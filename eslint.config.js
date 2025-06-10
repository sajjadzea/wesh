import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    files: ['src/**/*.js', 'test/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: { react },
    settings: {
      react: { version: 'detect' },
    },
    rules: {},
  },
];
