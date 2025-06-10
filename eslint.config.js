module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react"
  ],
  rules: {
    // اینجا رول‌های خاص خودت را اضافه کن
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
