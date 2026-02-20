// screens/statistik/util.ts
import { endOfWeek, format, startOfWeek, sub } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import type { FilterPeriode } from './tipe';

export const formatRupiah = (angka: number): string => {
  if (angka >= 1_000_000_000) return `Rp ${(angka / 1_000_000_000).toFixed(1)}M`;
  if (angka >= 1_000_000) return `Rp ${(angka / 1_000_000).toFixed(1)}Jt`;
  if (angka >= 1_000) return `Rp ${(angka / 1_000).toFixed(0)}Rb`;
  return `Rp ${angka}`;
};

export const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const getLabelPeriode = (periode: FilterPeriode, offset: number): string => {
  const sekarang = new Date();
  // Offset dibuat absolut karena nilainya negatif saat mundur (misal: -1 untuk kemarin)
  // sedangkan `sub` dari date-fns butuh angka positif untuk mengurangi tanggal.
  const offsetAbs = Math.abs(offset);

  if (periode === 'harian') {
    if (offset === 0) return 'Hari Ini';
    if (offset === -1) return 'Kemarin';
    const tgl = sub(sekarang, { days: offsetAbs });
    return format(tgl, 'EEEE, dd MMMM yyyy', { locale: idLocale });
  }

  if (periode === 'mingguan') {
    const targetMinggu = sub(sekarang, { weeks: offsetAbs });
    const senin = startOfWeek(targetMinggu, { weekStartsOn: 1 });
    const minggu = endOfWeek(targetMinggu, { weekStartsOn: 1 });
    const formatTanggal = (tgl: Date) => format(tgl, 'dd MMM', { locale: idLocale });
    return `${formatTanggal(senin)} - ${formatTanggal(minggu)} ${format(senin, 'yyyy')}`;
  }

  if (periode === 'bulanan') {
    const tgl = sub(sekarang, { months: offsetAbs });
    return format(tgl, 'MMMM yyyy', { locale: idLocale });
  }

  if (periode === 'tahunan') {
    const tgl = sub(sekarang, { years: offsetAbs });
    return format(tgl, 'yyyy');
  }

  return 'Semua Waktu';
};
{/** ask:  disini jika user pilih tanggal spesifik tolong buatkan logikanya 
 baca dahulu file  GEMINI.md
ini file terbaru yang sudah saya modifikasi jadi kamu gunakan data ini jangan gunakan data yang tersimpan di memori kamu
 selalu tulis kan jalur path file di paling atas setiap file
 tolong untuk penamaan variabel dan kunci usahakan gunakan bahasa indonesia terkecuali bahasa inggris nya yang sudah umum baru gunakana bahasa inggris nya
 */}
