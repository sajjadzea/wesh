import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['public/js/**', 'examples/**', 'public/assets/**', 'test/**'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: { react },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {},
  },
];
