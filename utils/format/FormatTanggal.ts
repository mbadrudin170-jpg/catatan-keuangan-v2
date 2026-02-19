// utils/format/FormatTanggal.ts

/**
 * Memformat objek Date menjadi string tanggal dengan format panjang.
 * Contoh: new Date() -> "17 Agustus 2024"
 * @param tanggal Objek Date yang akan diformat.
 * @returns String tanggal yang telah diformat.
 */
export const formatTanggal = (tanggal: Date): string => {
  const opsi: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return tanggal.toLocaleDateString('id-ID', opsi);
};

/**
 * Memformat objek Date menjadi string tanggal dengan format pendek (dd/mm/yyyy).
 * Contoh: new Date() -> "17/08/2024"
 * @param tanggal Objek Date yang akan diformat.
 * @returns String tanggal yang telah diformat.
 */
export const formatTanggalSingkat = (tanggal: Date): string => {
  const opsi: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return tanggal.toLocaleDateString('id-ID', opsi);
};

/**
 * Memformat objek Date menjadi string tanggal dengan format ringkas (dd mon yyyy).
 * Contoh: new Date() -> "17 Agu 2024"
 * @param tanggal Objek Date yang akan diformat.
 * @returns String tanggal yang telah diformat.
 */
export const formatTanggalRingkas = (tanggal: Date): string => {
  const opsi: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return tanggal.toLocaleDateString('id-ID', opsi);
};

/**
 * Memformat objek Date menjadi string tanggal dengan format sangat singkat (dd/mm/yy).
 * Contoh: new Date() -> "17/08/24"
 * @param tanggal Objek Date yang akan diformat.
 * @returns String tanggal yang telah diformat.
 */
export const formatTanggalSangatSingkat = (tanggal: Date): string => {
  const opsi: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  };
  return tanggal.toLocaleDateString('id-ID', opsi);
};
