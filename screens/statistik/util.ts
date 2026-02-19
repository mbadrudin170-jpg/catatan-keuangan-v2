// screens/statistik/util.ts
import { FilterPeriode } from './data';
import { format, sub, startOfWeek, endOfWeek } from 'date-fns';

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

  if (periode === 'harian') {
    const tgl = sub(sekarang, { days: offset });
    if (offset === 0) return 'Hari Ini';
    if (offset === -1) return 'Kemarin';
    return format(tgl, 'EEEE, dd MMMM yyyy');
  }

  if (periode === 'mingguan') {
    const targetMinggu = sub(sekarang, { weeks: offset });
    const senin = startOfWeek(targetMinggu, { weekStartsOn: 1 });
    const minggu = endOfWeek(targetMinggu, { weekStartsOn: 1 });
    const formatTanggal = (tgl: Date) => format(tgl, 'dd MMM');
    return `${formatTanggal(senin)} - ${formatTanggal(minggu)} ${format(senin, 'yyyy')}`;
  }

  if (periode === 'bulanan') {
    const tgl = sub(sekarang, { months: offset });
    return format(tgl, 'MMMM yyyy');
  }

  if (periode === 'tahunan') {
    const tgl = sub(sekarang, { years: offset });
    return format(tgl, 'yyyy');
  }

  return 'Semua Waktu';
};
