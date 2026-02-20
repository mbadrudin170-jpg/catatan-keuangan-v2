// screens/statistik/util.ts
import {
  format,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameYear,
} from 'date-fns';
import { id } from 'date-fns/locale';
import type { FilterPeriode } from './tipe';

const formatTanggal = (tanggal: Date, formatString: string) => {
  return format(tanggal, formatString, { locale: id });
};

export const getLabelPeriode = (
  periode: FilterPeriode,
  offset: number,
  rentangTanggal?: { mulai: Date; selesai: Date }
) => {
  const sekarang = new Date();

  switch (periode) {
    case 'harian':
      const tanggalHarian = addDays(sekarang, offset);
      if (offset === 0) return 'Hari Ini';
      if (offset === -1) return 'Kemarin';
      return formatTanggal(tanggalHarian, 'd MMM yyyy');

    case 'mingguan':
      const tanggalMingguan = addWeeks(sekarang, offset);
      const awalMinggu = startOfWeek(tanggalMingguan, { weekStartsOn: 1 });
      const akhirMinggu = endOfWeek(tanggalMingguan, { weekStartsOn: 1 });
      const formatAwal = isSameMonth(awalMinggu, akhirMinggu) ? 'd' : 'd MMM';
      const formatAkhir = isSameYear(awalMinggu, akhirMinggu) ? 'd MMM yyyy' : 'd MMM yyyy';
      return `${formatTanggal(awalMinggu, formatAwal)} - ${formatTanggal(
        akhirMinggu,
        formatAkhir
      )}`;

    case 'bulanan':
      const tanggalBulanan = addMonths(sekarang, offset);
      return formatTanggal(tanggalBulanan, 'MMMM yyyy');

    case 'tahunan':
      const tanggalTahunan = addYears(sekarang, offset);
      return formatTanggal(tanggalTahunan, 'yyyy');

    case 'semua':
      return 'Semua Waktu';

    case 'pilih tanggal':
        if (rentangTanggal) {
            const { mulai, selesai } = rentangTanggal;
            const formatMulai = isSameYear(mulai, selesai) ? 'd MMM' : 'd MMM yyyy';
            return `${formatTanggal(mulai, formatMulai)} - ${formatTanggal(selesai, 'd MMM yyyy')}`;
        }
        return 'Pilih Tanggal';

    default:
      return '';
  }
};

export const formatRupiah = (nilai: number) => 'Rp ' + nilai.toLocaleString('id-ID');
