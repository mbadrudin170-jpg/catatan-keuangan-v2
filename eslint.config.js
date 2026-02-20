// eslint.config.js

// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Menggunakan konfigurasi dasar ESLint untuk JS
  eslint.configs.recommended,

  // 2. Menggunakan konfigurasi rekomendasi TypeScript (tanpa info tipe)
  ...tseslint.configs.recommended,

  // 3. Konfigurasi untuk aturan yang MEMERLUKAN info tipe (hanya untuk file .ts/.tsx)
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Memastikan setiap fungsi asinkron (seperti operasi SQLite) menunggu promise selesai
      '@typescript-eslint/no-floating-promises': 'error',
      // Mencegah kesalahan penulisan 'await' yang tidak perlu atau tertinggal
      '@typescript-eslint/await-thenable': 'error',
      // Mencegah penggunaan data null/undefined tanpa pengecekan (Optional Chaining)
      '@typescript-eslint/no-unnecessary-condition': 'warn',
    },
  },

  // 4. Kustomisasi aturan umum (berlaku untuk semua file)
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Mengizinkan error dan warn
      // ... rules lainnya
      // Aturan diperluas untuk mendeteksi parameter yang tidak digunakan.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all', // Memeriksa semua parameter fungsi.
          argsIgnorePattern: '^_', // Mengabaikan parameter yang diawali dengan _.
          ignoreRestSiblings: true, // Mengabaikan sisa properti pada destrukturisasi objek.
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn', // Hindari penggunaan 'any' berlebihan.
      // Mencegah penggunaan variabel sebelum didefinisikan (sering menyebabkan ReferenceError)
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    },
  },

  // 5. Mengabaikan folder yang tidak perlu di-scan
  {
    ignores: [
      'node_modules/',
      '.expo/',
      '.next/',
      'dist/',
      'babel.config.cjs',
      'metro.config.js',
      'eslint.config.js',
      'jest.config.cjs',
      'jest.setup.js',
    ],
  }
);
