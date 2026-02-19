// screens/statistik/data.ts
import { Dompet, Kategori, Transaksi } from '@/database/tipe';

// ─────────────────────────────────────────────
// TIPE INTERNAL
// ─────────────────────────────────────────────
export type FilterPeriode = 'harian' | 'mingguan' | 'bulanan' | 'tahunan' | 'semua' | 'kalender';

export interface RingkasanKategori {
  kategori: Kategori;
  total: number;
  persentase: number;
}

export interface DataGrafikBatang {
  label: string;
  pemasukan: number;
  pengeluaran: number;
}

// ─────────────────────────────────────────────
// DATA DUMMY (untuk UI Development)
// ─────────────────────────────────────────────
export const DUMMY_TRANSAKSI: Transaksi[] = [];

export const DUMMY_KATEGORI: Kategori[] = [
  { id: 1, nama: 'Makan & Minum', ikon: '🍔', tipe: 'pengeluaran' },
  { id: 2, nama: 'Transportasi', ikon: '🚕', tipe: 'pengeluaran' },
  { id: 3, nama: 'Belanja', ikon: '🛒', tipe: 'pengeluaran' },
  { id: 4, nama: 'Tagihan', ikon: '🧾', tipe: 'pengeluaran' },
  { id: 5, nama: 'Gaji', ikon: '💰', tipe: 'pemasukan' },
  { id: 6, nama: 'Bonus', ikon: '🎁', tipe: 'pemasukan' },
  { id: 7, nama: 'Hiburan', ikon: '🎮', tipe: 'pengeluaran' },
  { id: 8, nama: 'Kesehatan', ikon: '🩺', tipe: 'pengeluaran' },
];

export const DUMMY_DOMPET: Dompet[] = [
  { id: 1, nama: 'BCA', tipe: 'Bank', saldo: 5250000, ikon: '🏦' },
  { id: 2, nama: 'GoPay', tipe: 'E-Wallet', saldo: 720000, ikon: '📱' },
  { id: 3, nama: 'Tunai', tipe: 'Cash', saldo: 125000, ikon: '💵' },
];

export const DUMMY_RINGKASAN_PENGELUARAN: RingkasanKategori[] = [
  { kategori: DUMMY_KATEGORI[0], total: 1250000, persentase: 55.8 },
  { kategori: DUMMY_KATEGORI[1], total: 450000, persentase: 20.1 },
  { kategori: DUMMY_KATEGORI[2], total: 300000, persentase: 13.4 },
  { kategori: DUMMY_KATEGORI[3], total: 240000, persentase: 10.7 },
];

export const DUMMY_RINGKASAN_PEMASUKAN: RingkasanKategori[] = [
  { kategori: DUMMY_KATEGORI[4], total: 10000000, persentase: 90.9 },
  { kategori: DUMMY_KATEGORI[5], total: 1000000, persentase: 9.1 },
];

export const DUMMY_GRAFIK: DataGrafikBatang[] = [
  { label: 'Jan', pemasukan: 10, pengeluaran: 2.5 },
  { label: 'Feb', pemasukan: 12, pengeluaran: 3 },
  { label: 'Mar', pemasukan: 11, pengeluaran: 2 },
  { label: 'Apr', pemasukan: 13, pengeluaran: 4 },
  { label: 'Mei', pemasukan: 10.5, pengeluaran: 2.2 },
  { label: 'Jun', pemasukan: 14, pengeluaran: 3.5 },
  { label: 'Jul', pemasukan: 11.5, pengeluaran: 2.8 },
];
