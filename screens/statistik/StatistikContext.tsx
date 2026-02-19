// screens/statistik/StatistikContext.tsx
import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import type { Dompet, Kategori, Transaksi } from '@/database/tipe'; // DIPERBAIKI
import { parseISO } from 'date-fns';
import React, { createContext, useContext, useMemo, useState } from 'react';
import type { DataGrafikBatang, FilterPeriode, RingkasanKategori } from './tipe';

// 1. Tipe untuk nilai yang akan disediakan oleh Context
interface StatistikContextType {
  totalPemasukan: number;
  totalPengeluaran: number;
  ringkasanPemasukan: RingkasanKategori[];
  ringkasanPengeluaran: RingkasanKategori[];
  dataGrafik: DataGrafikBatang[];
  tanggalAwal: Date;
  tanggalAkhir: Date;
  periode: FilterPeriode;
  setPeriode: (periode: FilterPeriode) => void;
  offsetPeriode: number;
  setOffsetPeriode: (offset: number) => void;
  tabKategori: 'pemasukan' | 'pengeluaran';
  setTabKategori: (tab: 'pemasukan' | 'pengeluaran') => void;
  // Data mentah yang dibutuhkan oleh komponen anak
  daftarDompet: Dompet[];
  daftarTransaksi: Transaksi[];
  daftarKategori: Kategori[];
}

// 2. Buat Context
const StatistikContext = createContext<StatistikContextType | undefined>(undefined);

// 3. Buat Provider Component
export const StatistikProvider = ({ children }: { children: React.ReactNode }) => {
  const [periode, setPeriode] = useState<FilterPeriode>('bulanan');
  const [offsetPeriode, setOffsetPeriode] = useState(0);
  const [tabKategori, setTabKategori] = useState<'pemasukan' | 'pengeluaran'>('pengeluaran');

  // Ambil data mentah dari context lain
  const { daftarTransaksi } = useTransaksi();
  const { daftarKategori } = useKategori();
  const { daftarDompet } = useDompet();

  const statistik = useMemo(() => {
    const sekarang = new Date();
    sekarang.setHours(0, 0, 0, 0);

    let tanggalAwal: Date;
    let tanggalAkhir: Date;

    switch (periode) {
      case 'tahunan':
        tanggalAwal = new Date(sekarang.getFullYear() + offsetPeriode, 0, 1);
        tanggalAkhir = new Date(sekarang.getFullYear() + offsetPeriode, 11, 31, 23, 59, 59);
        break;
      case 'mingguan':
        const mingguAwal = new Date(sekarang);
        mingguAwal.setDate(
          mingguAwal.getDate() +
            offsetPeriode * 7 -
            mingguAwal.getDay() +
            (mingguAwal.getDay() === 0 ? -6 : 1)
        );
        tanggalAwal = mingguAwal;
        tanggalAkhir = new Date(tanggalAwal);
        tanggalAkhir.setDate(tanggalAkhir.getDate() + 6);
        tanggalAkhir.setHours(23, 59, 59);
        break;
      case 'harian':
        tanggalAwal = new Date(sekarang);
        tanggalAwal.setDate(tanggalAwal.getDate() + offsetPeriode);
        tanggalAwal.setHours(0, 0, 0, 0);
        tanggalAkhir = new Date(tanggalAwal);
        tanggalAkhir.setHours(23, 59, 59);
        break;
      default: // bulanan
        tanggalAwal = new Date(sekarang.getFullYear(), sekarang.getMonth() + offsetPeriode, 1);
        tanggalAkhir = new Date(
          sekarang.getFullYear(),
          sekarang.getMonth() + offsetPeriode + 1,
          0,
          23,
          59,
          59
        );
        break;
    }

    const transaksiTerfilter = daftarTransaksi.filter((t) => {
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

    transaksiTerfilter.forEach((t) => {
      const kategori = daftarKategori.find((k) => k.id === t.kategori_id);
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
  }, [daftarTransaksi, daftarKategori, periode, offsetPeriode]);

  const value = {
    ...statistik,
    periode,
    setPeriode,
    offsetPeriode,
    setOffsetPeriode,
    tabKategori,
    setTabKategori,
    // Tambahkan data mentah ke dalam value
    daftarDompet,
    daftarTransaksi,
    daftarKategori,
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
