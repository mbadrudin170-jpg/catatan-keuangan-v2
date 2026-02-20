// utils/formatMataUang.ts

/**
 * Memformat angka menjadi string mata uang Rupiah (IDR).
 * @param angka - Angka yang akan diformat.
 * @returns String yang telah diformat, contoh: "Rp 1.500.000".
 */
export function formatMataUang(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // Tidak menampilkan angka di belakang koma
    maximumFractionDigits: 0, // Tidak menampilkan angka di belakang koma
  }).format(angka);
}
