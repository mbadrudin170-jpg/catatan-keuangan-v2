// database/operasi.ts
import type { Kategori, Subkategori, Transaksi, Dompet, TipeKategori } from '@/database/tipe';
import db from './sqlite';

// Operasi untuk Kategori
export const ambilSemuaKategori = async (tipe: TipeKategori): Promise<Kategori[]> => {
  const semuaKategori = await db.getAllAsync<Kategori>(
    'SELECT * FROM kategori WHERE tipe = ? ORDER BY nama ASC;', [tipe]
  );
  const semuaSubkategori = await db.getAllAsync<Subkategori>('SELECT * FROM subkategori;');

  return semuaKategori.map((kategori) => ({
    ...kategori,
    subkategori: semuaSubkategori.filter((sub) => sub.kategori_id === kategori.id),
  }));
};

export const tambahSatuKategori = async (kategori: Omit<Kategori, 'id' | 'subkategori'>): Promise<number | undefined> => {
  const hasil = await db.runAsync(
    'INSERT INTO kategori (nama, ikon, tipe) VALUES (?, ?, ?);', [kategori.nama, kategori.ikon || null, kategori.tipe]
  );
  return hasil.lastInsertRowId;
};

export const perbaruiSatuKategori = async (kategori: Omit<Kategori, 'subkategori'>): Promise<void> => {
  await db.runAsync(
    'UPDATE kategori SET nama = ?, ikon = ?, tipe = ? WHERE id = ?;', [kategori.nama, kategori.ikon || null, kategori.tipe, kategori.id]
  );
};

export const hapusSatuKategori = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM kategori WHERE id = ?;', [id]);
};

// Operasi untuk Subkategori
export const tambahSatuSubkategori = async (subkategori: Omit<Subkategori, 'id'>): Promise<number | undefined> => {
  const hasil = await db.runAsync(
    'INSERT INTO subkategori (nama, kategori_id) VALUES (?, ?);', [subkategori.nama, subkategori.kategori_id]
  );
  return hasil.lastInsertRowId;
};

export const perbaruiSatuSubkategori = async (subkategori: Subkategori): Promise<void> => {
  await db.runAsync(
    'UPDATE subkategori SET nama = ?, kategori_id = ? WHERE id = ?;',
    [subkategori.nama, subkategori.kategori_id, subkategori.id]
  );
};

export const hapusSatuSubkategori = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM subkategori WHERE id = ?;', [id]);
};

// Operasi untuk Transaksi
export const ambilSemuaTransaksi = async (): Promise<Transaksi[]> => {
  return await db.getAllAsync<Transaksi>(
    'SELECT * FROM transaksi ORDER BY tanggal DESC;'
  );
};

export const tambahSatuTransaksi = async (transaksi: Transaksi): Promise<number | undefined> => {
  const { jumlah, keterangan, tanggal, tipe, kategori_id, dompet_id, dompet_tujuan_id, subkategori_id, nama_kategori, nama_subkategori, nama_dompet, nama_dompet_tujuan } = transaksi;

  const hasil = await db.runAsync(
    `INSERT INTO transaksi 
     (jumlah, keterangan, tanggal, tipe, kategori_id, dompet_id, dompet_tujuan_id, subkategori_id, nama_kategori, nama_subkategori, nama_dompet, nama_dompet_tujuan) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [jumlah, keterangan || null, tanggal, tipe, kategori_id, dompet_id, dompet_tujuan_id || null, subkategori_id || null, nama_kategori || null, nama_subkategori || null, nama_dompet || null, nama_dompet_tujuan || null]
  );
  return hasil.lastInsertRowId;
};

export const hapusSemuaTransaksi = async (): Promise<void> => {
  await db.runAsync('DELETE FROM transaksi;');
};

// Operasi untuk Dompet
export const ambilSemuaDompet = async (): Promise<Dompet[]> => {
  return await db.getAllAsync<Dompet>('SELECT * FROM dompet ORDER BY nama ASC;');
};

export const tambahSatuDompet = async (dompet: Omit<Dompet, 'id' | 'saldo'>): Promise<number | undefined> => {
  const hasil = await db.runAsync(
    'INSERT INTO dompet (nama, tipe, ikon, saldo) VALUES (?, ?, ?, 0);', [dompet.nama, dompet.tipe || null, dompet.ikon || null]
  );
  return hasil.lastInsertRowId;
};

export const perbaruiSatuDompet = async (dompet: Omit<Dompet, 'saldo'>): Promise<void> => {
  await db.runAsync(
    'UPDATE dompet SET nama = ?, tipe = ?, ikon = ? WHERE id = ?;', [dompet.nama, dompet.tipe || null, dompet.ikon || null, dompet.id]
  );
};

export const perbaruiSaldoDompet = async (id: number, jumlah: number): Promise<void> => {
  await db.runAsync('UPDATE dompet SET saldo = saldo + ? WHERE id = ?;', [jumlah, id]);
};

export const resetSemuaSaldoDompet = async (): Promise<void> => {
  await db.runAsync('UPDATE dompet SET saldo = 0;');
};

export const hapusSatuDompet = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM dompet WHERE id = ?;', [id]);
};

export const hapusSemuaDompet = async (): Promise<void> => {
  await db.runAsync('DELETE FROM dompet;');
};
