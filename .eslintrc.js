// .eslintrc.js
module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['module:metro-react-native-babel-preset'],
    },
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    'react-native/react-native': true,
  },
  plugins: ['react', 'react-native'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-native/all'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // Allow unused parameters that start with underscore (common pattern for required but unused params)
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    // Allow inline styles for React Native (they're common and acceptable)
    'react-native/no-inline-styles': 'warn',

    // Allow unescaped entities in JSX (React Native handles this fine)
    'react/no-unescaped-entities': 'off',

    // Turn off overly strict style rules
    'react-native/sort-styles': 'off',
    'react-native/no-color-literals': 'off',
    'react/prop-types': 'off',
    'no-console': 'off',
  },
};
