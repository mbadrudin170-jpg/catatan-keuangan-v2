// eslint.config.js
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
// @ts-ignore
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  // 1. Base Configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,

  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // --- DETEKSI IMPORT/EXPORT (MENGATASI ts(2305)) ---
      // Kita aktifkan ini untuk membantu editor memberikan feedback instan
      'import/named': 'error',
      'import/no-duplicates': 'warn',

      // --- PENGHAPUSAN BENTROK (ANTI-CONFLICT) ---
      // Kita matikan aturan ESLint bawaan yang sudah dihandle lebih baik oleh TS
      'import/no-unresolved': 'off', // TS sudah handle ini, biar tidak bentrok saat pakai Alias Path
      'no-undef': 'off', // TypeScript sudah mengecek variabel undefined secara native

      // --- LOGIKA ASYNC ---
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // Mengubah ke 'warn' agar tidak menghalangi build jika ada pengecekan null yang dianggap berlebihan
      '@typescript-eslint/no-unnecessary-condition': 'warn',
    },
  },

  {
    rules: {
      // --- ATURAN CONSOLE ---
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // --- ATURAN VARIABEL & LINGKUP ---
      '@typescript-eslint/no-unused-vars': [
        'error', // Artinya: Jika ada variabel tak terpakai, anggap Error (Garis Merah).
        {
          args: 'all', // Periksa semua parameter fungsi.
          argsIgnorePattern: '^_', // Abaikan parameter jika namanya diawali _
          varsIgnorePattern: '^_', // Abaikan variabel jika namanya diawali _ (kategoriInduk -> _kategoriInduk)
          ignoreRestSiblings: true, // Berguna saat bongkar pasang objek (destructuring).
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Mematikan aturan JS bawaan untuk menghindari duplikasi peringatan dengan aturan TS
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: false, // Diatur false agar tidak bentrok dengan hoisting sederhana
        },
      ],
    },
  },

  {
    ignores: [
      'node_modules/',
      '.expo/',
      '.next/',
      'dist/',
      '*.config.js',
      '*.config.cjs',
      'jest.setup.js',
    ],
  }
);
