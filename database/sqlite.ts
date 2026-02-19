// database/sqlite.ts
import * as SQLite from 'expo-sqlite';

// Definisikan tipe untuk kolom dari PRAGMA table_info
interface PragmaKolomInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | number | null;
  pk: number;
}

// Membuka database secara sinkron
const db = SQLite.openDatabaseSync('catatanKeuangan.db');

/**
 * Fungsi migrasi untuk memeriksa dan menambahkan kolom yang hilang.
 * INI PENTING: Jangan hapus fungsi ini. Ini untuk memastikan pengguna lama
 * mendapatkan skema database terbaru tanpa kehilangan data.
 */
const migrasiSkema = async (): Promise<void> => {
  try {
    // Migrasi untuk tabel 'dompet'
    const kolomDompet = await db.getAllAsync<PragmaKolomInfo>('PRAGMA table_info(dompet);');
    const namaKolomDompet = kolomDompet.map((kolom) => kolom.name);

    if (!namaKolomDompet.includes('tipe')) {
      console.warn('MIGRASI: Menambahkan kolom "tipe" ke tabel dompet...');
      await db.execAsync('ALTER TABLE dompet ADD COLUMN tipe TEXT;');
    }

    if (!namaKolomDompet.includes('ikon')) {
      console.warn('MIGRASI: Menambahkan kolom "ikon" ke tabel dompet...');
      await db.execAsync('ALTER TABLE dompet ADD COLUMN ikon TEXT;');
    }
  } catch {
    // Jika tabel belum ada, PRAGMA akan error. Ini aman untuk diabaikan
    // karena CREATE TABLE akan membuat tabel baru dengan skema yang benar.
    console.warn('Tabel belum ada, akan dibuat oleh CREATE TABLE.');
  }
};

/**
 * Inisialisasi Database dan Tabel
 */
export const inisialisasiDB = async (): Promise<void> => {
  try {
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Skema tabel terbaru. Kolom 'tipe' dan 'ikon' sudah ditambahkan di sini.
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS kategori (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL UNIQUE,
        ikon TEXT,
        tipe TEXT NOT NULL CHECK(tipe IN ('pemasukan', 'pengeluaran'))
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
        kategori_id INTEGER,
        dompet_id INTEGER,
        FOREIGN KEY (kategori_id) REFERENCES kategori (id) ON DELETE SET NULL,
        FOREIGN KEY (dompet_id) REFERENCES dompet (id) ON DELETE CASCADE
      );
    `);

    // Jalankan migrasi. Untuk pengguna baru, ini tidak akan melakukan apa-apa.
    // Untuk pengguna lama, ini akan menambahkan kolom yang hilang dengan aman.
    await migrasiSkema();
  } catch (error) {
    console.error('Gagal melakukan inisialisasi database:', error);
    throw error;
  }
};

export default db;
