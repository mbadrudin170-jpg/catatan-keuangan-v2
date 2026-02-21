// database/operasi.ts
import type {
  Anggaran,
  Dompet,
  Kategori,
  RincianAnggaran,
  Subkategori,
  TipeKategori,
  Transaksi,
} from '@/database/tipe';
import { db } from './sqlite';

// Operasi untuk Kategori
export const ambilSemuaKategori = async (tipe: TipeKategori): Promise<Kategori[]> => {
  const semuaKategori = await db.getAllAsync<Kategori>(
    'SELECT * FROM kategori WHERE tipe = ? ORDER BY nama ASC;', [tipe]
  );
  const semuaSubkategori = await db.getAllAsync<Subkategori>('SELECT * FROM subkategori;');

  return semuaKategori.map((kategori: Kategori) => ({
    ...kategori,
    subkategori: semuaSubkategori.filter((sub: Subkategori) => sub.kategori_id === kategori.id),
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

export const tambahSatuDompet = async (dompet: Omit<Dompet, 'id'>): Promise<number | undefined> => {
  const hasil = await db.runAsync(
    'INSERT INTO dompet (nama, tipe, ikon, saldo) VALUES (?, ?, ?, ?);', [dompet.nama, dompet.tipe || null, dompet.ikon || null, dompet.saldo || 0]
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

// Operasi untuk Anggaran (dengan Rincian)

/**
 * Menambahkan anggaran baru beserta rinciannya ke dalam database menggunakan transaksi.
 * @param anggaranData Data utama anggaran.
 * @param rincianData Array dari rincian anggaran per subkategori.
 * @returns ID dari anggaran yang baru dibuat.
 */
export const tambahAnggaranDenganRincian = async (
  anggaranData: Omit<Anggaran, 'id' | 'rincian' | 'nama_kategori'>,
  rincianData: Omit<RincianAnggaran, 'id' | 'anggaran_id' | 'nama_subkategori'>[]
): Promise<number | undefined> => {
  let anggaranId: number | undefined;

  await db.withTransactionAsync(async () => {
    // 1. Masukkan data ke tabel anggaran utama
    const hasil = await db.runAsync(
      'INSERT INTO anggaran (total_anggaran, tipe, periode, tanggal_mulai, kategori_id) VALUES (?, ?, ?, ?, ?);',
      [
        anggaranData.total_anggaran,
        anggaranData.tipe,
        anggaranData.periode,
        anggaranData.tanggal_mulai,
        anggaranData.kategori_id,
      ]
    );
    anggaranId = hasil.lastInsertRowId;

    if (!anggaranId) {
      throw new Error('Gagal mendapatkan ID anggaran yang baru dibuat.');
    }

    // 2. Masukkan semua rincian ke tabel rincian_anggaran
    for (const rincian of rincianData) {
      await db.runAsync(
        'INSERT INTO rincian_anggaran (anggaran_id, subkategori_id, jumlah) VALUES (?, ?, ?);',
        [anggaranId, rincian.subkategori_id, rincian.jumlah]
      );
    }
  });

  return anggaranId;
};

/**
 * Mengambil semua anggaran beserta rincian subkategorinya.
 * @returns Array dari objek Anggaran, masing-masing berisi rinciannya.
 */
export const ambilSemuaAnggaranDenganRincian = async (): Promise<Anggaran[]> => {
  // 1. Ambil semua anggaran utama beserta nama kategorinya
  const semuaAnggaran = await db.getAllAsync<Anggaran>(
    `SELECT a.*, k.nama as nama_kategori 
     FROM anggaran a 
     JOIN kategori k ON a.kategori_id = k.id 
     ORDER BY k.nama ASC;`
  );

  // 2. Ambil semua rincian anggaran beserta nama subkategorinya
  const semuaRincian = await db.getAllAsync<RincianAnggaran>(
    `SELECT r.*, s.nama as nama_subkategori
     FROM rincian_anggaran r
     JOIN subkategori s ON r.subkategori_id = s.id;`
  );

  // 3. Gabungkan rincian ke dalam masing-masing anggaran
  return semuaAnggaran.map(anggaran => ({
    ...anggaran,
    rincian: semuaRincian.filter(rincian => rincian.anggaran_id === anggaran.id),
  }));
};

/**
 * Menghapus sebuah anggaran dan semua rincian terkaitnya (via ON DELETE CASCADE).
 * @param id ID dari anggaran yang akan dihapus.
 */
export const hapusAnggaran = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM anggaran WHERE id = ?;', [id]);
};

/**
 * Menghapus SEMUA anggaran dan semua rincian terkaitnya.
 * Perintah ini akan mengosongkan tabel `anggaran` dan `rincian_anggaran`.
 */
export const hapusSemuaAnggaran = async (): Promise<void> => {
  // `ON DELETE CASCADE` pada foreign key di `rincian_anggaran` akan otomatis
  // menghapus semua rincian yang terkait saat anggaran induknya dihapus.
  await db.runAsync('DELETE FROM anggaran;');
};
