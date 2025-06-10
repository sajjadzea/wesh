const js = require('@eslint/js');
const globals = require('globals');
const react = require('eslint-plugin-react');

module.exports = [
  {
    ignores: ['public/js/**', 'examples/**', 'public/assets/**', 'test/**'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  react.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
