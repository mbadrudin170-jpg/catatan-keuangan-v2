// screens/statistik/tipe.ts

/**
 * Mendefinisikan tipe periode yang bisa dipilih untuk filter.
 * - `harian`: data ditampilkan per hari.
 * - `mingguan`: data ditampilkan per minggu.
 * - `bulanan`: data ditampilkan per bulan.
 * - `tahunan`: data ditampilkan per tahun.
 */
export type FilterPeriode = 'harian' | 'mingguan' | 'bulanan' | 'tahunan';

/**
 * Struktur data untuk setiap batang pada komponen GrafikBatang.
 */
export interface DataGrafikBatang {
  label: string; // Label yang muncul di bawah batang (mis: "Jan", "Feb")
  pemasukan: number; // Nilai total pemasukan untuk periode tersebut
  pengeluaran: number; // Nilai total pengeluaran untuk periode tersebut
}

/**
 * Struktur data untuk ringkasan pengeluaran atau pemasukan per kategori.
 */
export interface RingkasanKategori {
  id: number; // ID unik dari kategori
  nama: string; // Nama kategori
  ikon: string; // Nama ikon dari `expo-vector-icons`
  total: number; // Total jumlah transaksi untuk kategori ini
}
