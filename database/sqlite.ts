// database/sqlite.ts
import * as SQLite from 'expo-sqlite';

// Definisikan tipe untuk kolom dari PRAGMA table_info
interface PragmaKolomInfo {
  id: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | number | null;
  pk: number;
}

// Membuka database secara sinkron
const db = SQLite.openDatabaseSync('catatanKeuangan.db');

/**
 * Fungsi ini sengaja dikosongkan untuk menonaktifkan proses seeding data awal.
 */
const seedDataAwal = async (): Promise<void> => {
  // Seeding data awal dinonaktifkan sesuai permintaan.
};

/**
 * Fungsi migrasi untuk memeriksa dan menambahkan kolom yang hilang.
 */
const migrasiSkema = async (): Promise<void> => {
  try {
    // Migrasi untuk tabel 'dompet'
    const kolomDompet = await db.getAllAsync<PragmaKolomInfo>('PRAGMA table_info(dompet);');
    const namaKolomDompet = kolomDompet.map((kolom) => kolom.name);

    if (!namaKolomDompet.includes('tipe')) {
      await db.execAsync('ALTER TABLE dompet ADD COLUMN tipe TEXT;');
    }
    if (!namaKolomDompet.includes('ikon')) {
      await db.execAsync('ALTER TABLE dompet ADD COLUMN ikon TEXT;');
    }

    // Migrasi untuk tabel 'transaksi'
    const kolomTransaksi = await db.getAllAsync<PragmaKolomInfo>('PRAGMA table_info(transaksi);');
    const namaKolomTransaksi = kolomTransaksi.map((kolom) => kolom.name);

    if (!namaKolomTransaksi.includes('tipe')) {
      await db.execAsync(
        "ALTER TABLE transaksi ADD COLUMN tipe TEXT NOT NULL DEFAULT 'pengeluaran';"
      );
    }
    if (!namaKolomTransaksi.includes('dompet_tujuan_id')) {
      await db.execAsync('ALTER TABLE transaksi ADD COLUMN dompet_tujuan_id INTEGER;');
    }
    if (!namaKolomTransaksi.includes('subkategori_id')) {
      await db.execAsync('ALTER TABLE transaksi ADD COLUMN subkategori_id INTEGER;');
    }
  } catch {
    console.warn('Tabel belum ada, akan dibuat oleh CREATE TABLE.');
  }
};

/**
 * Inisialisasi Database dan Tabel
 */
export const inisialisasiDB = async (): Promise<void> => {
  try {
    await db.execAsync('PRAGMA foreign_keys = ON;');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS kategori (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL UNIQUE,
        ikon TEXT,
        tipe TEXT NOT NULL CHECK(tipe IN ('pemasukan', 'pengeluaran'))
      );
      CREATE TABLE IF NOT EXISTS subkategori (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        kategori_id INTEGER NOT NULL,
        FOREIGN KEY (kategori_id) REFERENCES kategori (id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS dompet (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL UNIQUE,
        saldo REAL NOT NULL DEFAULT 0,
        tipe TEXT,
        ikon TEXT
      );
      CREATE TABLE IF NOT EXISTS transaksi (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jumlah REAL NOT NULL,
        keterangan TEXT,
        tanggal TEXT NOT NULL,
        tipe TEXT NOT NULL CHECK(tipe IN ('pemasukan', 'pengeluaran', 'transfer')),
        kategori_id INTEGER,
        dompet_id INTEGER NOT NULL,
        dompet_tujuan_id INTEGER,
        subkategori_id INTEGER,
        FOREIGN KEY (kategori_id) REFERENCES kategori (id) ON DELETE SET NULL,
        FOREIGN KEY (dompet_id) REFERENCES dompet (id) ON DELETE CASCADE,
        FOREIGN KEY (dompet_tujuan_id) REFERENCES dompet(id) ON DELETE SET NULL,
        FOREIGN KEY (subkategori_id) REFERENCES subkategori(id) ON DELETE SET NULL
      );
    `);

    await migrasiSkema();
    // Panggilan ke seedDataAwal() dihapus untuk menonaktifkan seeding.
  } catch (error) {
    console.error('Gagal melakukan inisialisasi database:', error);
    throw error;
  }
};

export default db;
