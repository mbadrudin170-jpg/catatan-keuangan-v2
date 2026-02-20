// screens/statistik/StatistikContext.tsx
import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import type { Dompet, Kategori, Transaksi } from '@/database/tipe';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import React, { createContext, useContext, useMemo, useState } from 'react';
import type { DataGrafikBatang, FilterPeriode, RingkasanKategori } from './tipe';

// 1. Tipe untuk nilai yang akan disediakan oleh Context
interface StatistikContextType {
  totalPemasukan: number;
  totalPengeluaran: number;
  ringkasanPemasukan: RingkasanKategori[];
  ringkasanPengeluaran: RingkasanKategori[];
  dataGrafik: DataGrafikBatang[];
  tanggalAwal?: Date;
  tanggalAkhir?: Date;
  periode: FilterPeriode;
  setPeriode: (periode: FilterPeriode) => void;
  offsetPeriode: number;
  setOffsetPeriode: (offset: number) => void;
  tabKategori: 'pemasukan' | 'pengeluaran';
  setTabKategori: (tab: 'pemasukan' | 'pengeluaran') => void;
  rentangTanggal: { mulai: Date; selesai: Date };
  setRentangTanggal: (rentang: { mulai: Date; selesai: Date }) => void;
  // Data mentah yang dibutuhkan oleh komponen anak
  daftarDompet: Dompet[];
  semuaTransaksi: Transaksi[];
  semuaKategori: Kategori[];
}

// 2. Buat Context
const StatistikContext = createContext<StatistikContextType | undefined>(undefined);

// 3. Buat Provider Component
export const StatistikProvider = ({ children }: { children: React.ReactNode }) => {
  const [periode, setPeriode] = useState<FilterPeriode>('bulanan');
  const [offsetPeriode, setOffsetPeriode] = useState(0);
  const [tabKategori, setTabKategori] = useState<'pemasukan' | 'pengeluaran'>('pengeluaran');
  const [rentangTanggal, setRentangTanggal] = useState({
    mulai: startOfMonth(new Date()),
    selesai: endOfMonth(new Date()),
  });

  // Ambil data mentah dari context lain
  const { semuaTransaksi } = useTransaksi();
  const { semuaKategori } = useKategori();
  const { daftarDompet } = useDompet();

  const statistik = useMemo(() => {
    const sekarang = new Date();
    let tanggalAwal: Date | undefined = undefined;
    let tanggalAkhir: Date | undefined = undefined;

    switch (periode) {
      case 'tahunan':
        const tahunSekarang = new Date(sekarang.getFullYear() + offsetPeriode, 0, 1);
        tanggalAwal = startOfYear(tahunSekarang);
        tanggalAkhir = endOfYear(tahunSekarang);
        break;
      case 'mingguan':
        const mingguSekarang = new Date();
        mingguSekarang.setDate(mingguSekarang.getDate() + offsetPeriode * 7);
        tanggalAwal = startOfWeek(mingguSekarang, { weekStartsOn: 1 });
        tanggalAkhir = endOfWeek(mingguSekarang, { weekStartsOn: 1 });
        break;
      case 'harian':
        const hariSekarang = new Date();
        hariSekarang.setDate(hariSekarang.getDate() + offsetPeriode);
        tanggalAwal = startOfDay(hariSekarang);
        tanggalAkhir = endOfDay(hariSekarang);
        break;
      case 'pilih tanggal':
        tanggalAwal = startOfDay(rentangTanggal.mulai);
        tanggalAkhir = endOfDay(rentangTanggal.selesai);
        break;
      case 'semua':
        tanggalAwal = undefined;
        tanggalAkhir = undefined;
        break;
      default: // bulanan
        const bulanSekarang = new Date();
        bulanSekarang.setMonth(bulanSekarang.getMonth() + offsetPeriode);
        tanggalAwal = startOfMonth(bulanSekarang);
        tanggalAkhir = endOfMonth(bulanSekarang);
        break;
    }

    const transaksiTerfilter = semuaTransaksi.filter((t: Transaksi) => {
      if (!tanggalAwal || !tanggalAkhir) return true; // Untuk kasus 'semua'
      const tanggalTransaksi = parseISO(t.tanggal);
      return tanggalTransaksi >= tanggalAwal && tanggalTransaksi <= tanggalAkhir;
    });

    let totalPemasukan = 0;
    let totalPengeluaran = 0;
    const ringkasanPemasukanMap = new Map<number, { total: number; nama: string; ikon: string }>();
    const ringkasanPengeluaranMap = new Map<
      number,
      { total: number; nama: string; ikon: string }
    >();

    transaksiTerfilter.forEach((t: Transaksi) => {
      const kategori = semuaKategori.find((k: Kategori) => k.id === t.kategori_id);
      if (!kategori) return;

      const ikonKategori = kategori.ikon || '';

      if (kategori.tipe === 'pemasukan') {
        totalPemasukan += t.jumlah;
        const data = ringkasanPemasukanMap.get(kategori.id) || {
          total: 0,
          nama: kategori.nama,
          ikon: ikonKategori,
        };
        data.total += t.jumlah;
        ringkasanPemasukanMap.set(kategori.id, data);
      } else {
        totalPengeluaran += t.jumlah;
        const data = ringkasanPengeluaranMap.get(kategori.id) || {
          total: 0,
          nama: kategori.nama,
          ikon: ikonKategori,
        };
        data.total += t.jumlah;
        ringkasanPengeluaranMap.set(kategori.id, data);
      }
    });

    const ringkasanPemasukan: RingkasanKategori[] = Array.from(ringkasanPemasukanMap.entries()).map(
      ([id, data]) => ({ id, ...data })
    );
    const ringkasanPengeluaran: RingkasanKategori[] = Array.from(
      ringkasanPengeluaranMap.entries()
    ).map(([id, data]) => ({ id, ...data }));

    const dataGrafik: DataGrafikBatang[] = [];

    return {
      totalPemasukan,
      totalPengeluaran,
      ringkasanPemasukan,
      ringkasanPengeluaran,
      dataGrafik,
      tanggalAwal,
      tanggalAkhir,
    };
  }, [semuaTransaksi, semuaKategori, periode, offsetPeriode, rentangTanggal]);

  const value: StatistikContextType = {
    ...statistik,
    periode,
    setPeriode,
    offsetPeriode,
    setOffsetPeriode,
    tabKategori,
    setTabKategori,
    rentangTanggal,
    setRentangTanggal,
    // Tambahkan data mentah ke dalam value
    daftarDompet,
    semuaTransaksi,
    semuaKategori,
  };

  return <StatistikContext.Provider value={value}>{children}</StatistikContext.Provider>;
};

// 4. Buat custom hook
export const useStatistik = () => {
  const context = useContext(StatistikContext);
  if (context === undefined) {
    throw new Error('useStatistik harus digunakan di dalam StatistikProvider');
  }
  return context;
};
