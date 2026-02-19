// utils/format/FormatJam.ts

/**
 * Memformat objek Date menjadi string waktu dengan format 24 jam (HH:mm).
 * @param tanggal Objek Date yang akan diformat.
 * @returns String waktu yang telah diformat (misal: "13:00").
 */
export const formatJam = (tanggal: Date): string => {
  return tanggal.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Memastikan penggunaan format 24 jam
  });
};
