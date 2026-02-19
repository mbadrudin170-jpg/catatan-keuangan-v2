// path: ./eslint.config.js

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/**
 * Konfigurasi ESLint Fokus pada Bug Prevention.
 * Menghapus aturan kosmetik/formatting.
 */
module.exports = defineConfig([
  expoConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      // 1. Mencegah logika perbandingan yang salah (Type Coercion bug)
      eqeqeq: ['warn', 'always'],

      // 2. Mencegah error 'Uncaught Promise Rejection' yang bisa membuat aplikasi berhenti/hang
      '@typescript-eslint/no-floating-promises': 'warn',

      // 3. Menghindari variabel sisa logika atau variabel yang tertukar/tidak terpakai
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // 4. Memaksa keamanan tipe data agar tidak terjadi runtime error 'undefined'
      '@typescript-eslint/no-explicit-any': 'warn',

      // 5. Menghindari penggunaan console log berlebih yang bisa memperlambat performa di production
      // Namun tetap mengizinkan error log agar bug terpantau.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'babel.config.js', 'metro.config.js'],
  },
]);
