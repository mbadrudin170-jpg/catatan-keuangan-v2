// database/operasi.ts
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  sub,
} from 'date-fns';

import type { RingkasanKategori } from '@/screens/statistik/tipe';
import db from './sqlite';
import type { Dompet, Kategori, Subkategori, Transaksi, TipeTransaksi } from './tipe';

// Tipe untuk hasil mentah dari query statistik
interface HasilQueryStatistik {
  id: number;
  tipe: TipeTransaksi;
  total: number;
  kategori_nama: string;
  kategori_ikon: string;
}

// Tipe untuk hasil statistik yang sudah diproses
export interface DataGrafik {
  label: string;
  pemasukan: number;
  pengeluaran: number;
}

export interface HasilStatistik {
  totalPemasukan: number;
  totalPengeluaran: number;
  ringkasanPemasukan: RingkasanKategori[];
  ringkasanPengeluaran: RingkasanKategori[];
  dataGrafik: DataGrafik[];
}

// ─────────────────────────────────────────────
// OPERASI KATEGORI
// ─────────────────────────────────────────────

export const ambilSemuaKategori = async (): Promise<Kategori[]> => {
  const daftarKategori = await db.getAllAsync<Omit<Kategori, 'subkategori'>>(
    'SELECT * FROM kategori ORDER BY nama ASC;'
  );
  const daftarSubkategori = await db.getAllAsync<Subkategori>(
    'SELECT * FROM subkategori ORDER BY nama ASC;'
  );

  const subkategoriMap = new Map<number, Subkategori[]>();
  for (const sub of daftarSubkategori) {
    if (!subkategoriMap.has(sub.kategori_id)) {
      subkategoriMap.set(sub.kategori_id, []);
    }
    subkategoriMap.get(sub.kategori_id)!.push(sub);
  }

  return daftarKategori.map((kategori) => ({
    ...kategori,
    subkategori: subkategoriMap.get(kategori.id) || [],
  }));
};

export const tambahKategori = async (
  nama: string,
  ikon: string,
  tipe: TipeTransaksi
): Promise<void> => {
  await db.runAsync(
    'INSERT INTO kategori (nama, ikon, tipe) VALUES (?, ?, ?);',
    nama,
    ikon,
    tipe
  );
};

export const perbaruiKategori = async (
  id: number,
  nama: string,
  ikon: string
): Promise<void> => {
  await db.runAsync(
    'UPDATE kategori SET nama = ?, ikon = ? WHERE id = ?;',
    nama,
    ikon,
    id
  );
};

export const hapusKategori = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM kategori WHERE id = ?;', id);
};

// ─────────────────────────────────────────────
// OPERASI SUBKATEGORI
// ─────────────────────────────────────────────

export const tambahSubkategori = async (nama: string, kategori_id: number): Promise<void> => {
  await db.runAsync(
    'INSERT INTO subkategori (nama, kategori_id) VALUES (?, ?);',
    nama,
    kategori_id
  );
};

export const perbaruiSubkategori = async (id: number, nama: string): Promise<void> => {
  await db.runAsync('UPDATE subkategori SET nama = ? WHERE id = ?;', nama, id);
};

export const hapusSubkategori = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM subkategori WHERE id = ?;', id);
};

// ─────────────────────────────────────────────
// OPERASI DOMPET
// ─────────────────────────────────────────────

export const ambilSemuaDompet = async (): Promise<Dompet[]> => {
  return await db.getAllAsync('SELECT * FROM dompet ORDER BY nama ASC;');
};

export const ambilSatuDompet = async (id: number): Promise<Dompet | null> => {
  const hasil = await db.getFirstAsync<Dompet>('SELECT * FROM dompet WHERE id = ?', id);
  return hasil ?? null;
};

export const tambahDompet = async (
  nama: string,
  saldo: number,
  tipe: string,
  ikon: string
): Promise<void> => {
  await db.runAsync(
    'INSERT INTO dompet (nama, saldo, tipe, ikon) VALUES (?, ?, ?, ?);',
    nama,
    saldo,
    tipe,
    ikon
  );
};

export const perbaruiDompet = async (
  id: number,
  nama: string,
  saldo: number,
  tipe: string,
  ikon: string
): Promise<void> => {
  await db.runAsync(
    'UPDATE dompet SET nama = ?, saldo = ?, tipe = ?, ikon = ? WHERE id = ?;',
    nama,
    saldo,
    tipe,
    ikon,
    id
  );
};

export const hapusDompet = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM dompet WHERE id = ?;', id);
};

// ─────────────────────────────────────────────
// OPERASI TRANSAKSI
// ─────────────────────────────────────────────
export const ambilSemuaTransaksi = async (): Promise<Transaksi[]> => {
  return await db.getAllAsync('SELECT * FROM transaksi ORDER BY tanggal DESC;');
};

// ... (sisa kode statistik tidak berubah)
