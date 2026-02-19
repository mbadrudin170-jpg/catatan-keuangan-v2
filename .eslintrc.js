module.exports = {
  root: true,
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    eqeqeq: ['warn', 'always'],
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/display-name': 'off',
  },
  ignorePatterns: ['dist/*', '.expo/*', 'node_modules/*', 'babel.config.js', 'metro.config.js'],
};
