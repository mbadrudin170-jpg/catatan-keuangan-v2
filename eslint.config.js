// eslint.config.js

// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Menggunakan konfigurasi dasar ESLint untuk JS
  eslint.configs.recommended,

  // 2. Menggunakan konfigurasi rekomendasi untuk TypeScript
  ...tseslint.configs.recommended,

  // 3. Kustomisasi aturan (Optional tapi disarankan)
  {
    rules: {
      'no-console': 'warn', // Peringatan jika ada console.log yang tertinggal
      '@typescript-eslint/no-unused-vars': 'error', // Error jika ada variabel tidak terpakai
      '@typescript-eslint/no-explicit-any': 'warn', // Hindari penggunaan 'any' berlebihan
    },
  },

  // 4. Mengabaikan folder yang tidak perlu di-scan untuk menghemat RAM 4GB Anda
  {
    ignores: ['node_modules/', '.expo/', '.next/', 'dist/', 'babel.config.js', 'metro.config.js'],
  }
);
