// utils/format/FormatAngka.ts

interface FormatAngkaOptions {
  denganTanda?: boolean;
}

/**
 * Mengubah angka menjadi format string dengan pemisah ribuan.
 * @param angka Angka yang akan diformat.
 * @param options Opsi pemformatan, seperti { denganTanda: true }.
 * @returns String angka yang telah diformat.
 */
export const formatAngka = (angka: number, options?: FormatAngkaOptions): string => {
  // Menggunakan Intl.NumberFormat untuk penanganan format yang lebih baik dan lokalisasi
  const formatter = new Intl.NumberFormat('id-ID', {
    // Opsi ini akan ditambahkan jika 'denganTanda' bernilai true
    signDisplay: options?.denganTanda ? 'exceptZero' : 'auto',
  });

  return formatter.format(angka);
};

/**
 * Mengubah string format angka kembali menjadi tipe number.
 * Contoh: "10.000" -> 10000
 * @param teksAngka String angka yang akan di-parse.
 * @returns Angka hasil parse.
 */
export const parseAngka = (teksAngka: string): number => {
  // Hapus semua karakter selain angka dan tanda minus di awal
  const angkaString = teksAngka.replace(/[^\d-]/g, '').replace(/\./g, '');
  return parseInt(angkaString, 10) || 0;
};
