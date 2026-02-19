// utils/format/FormatAngka.ts

/**
 * Mengubah angka menjadi format string dengan pemisah ribuan.
 * Contoh: 10000 -> "10.000"
 * @param angka Angka yang akan diformat.
 * @returns String angka yang telah diformat.
 */
export const formatAngka = (angka: number): string => {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Mengubah string format angka kembali menjadi tipe number.
 * Contoh: "10.000" -> 10000
 * @param teksAngka String angka yang akan di-parse.
 * @returns Angka hasil parse.
 */
export const parseAngka = (teksAngka: string): number => {
  // Hapus semua karakter selain angka (misalnya, titik pemisah ribuan)
  const angkaString = teksAngka.replace(/[^\d]/g, '');
  return parseInt(angkaString, 10) || 0;
};
