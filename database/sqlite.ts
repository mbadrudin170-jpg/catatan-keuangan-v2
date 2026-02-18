// database/sqlite.ts
import * as SQLite from 'expo-sqlite';

// Membuka database secara sinkron (rekomendasi terbaru Expo)
const db = SQLite.openDatabaseSync('catatanKeuangan.db');

/**
 * Inisialisasi Database dan Tabel
 * Menggunakan execAsync untuk eksekusi skema SQL sekaligus
 */
export const inisialisasiDB = async (): Promise<void> => {
  try {
    // Aktifkan Foreign Key Support (Penting untuk relasi antar tabel)
    await db.execAsync('PRAGMA foreign_keys = ON;');

    await db.execAsync(`
      -- Tabel Kategori
      CREATE TABLE IF NOT EXISTS kategori (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL UNIQUE,
        ikon TEXT,
        tipe TEXT NOT NULL CHECK(tipe IN ('pemasukan', 'pengeluaran'))
      );

      -- Tabel Dompet
      CREATE TABLE IF NOT EXISTS dompet (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL UNIQUE,
        saldo REAL NOT NULL DEFAULT 0
      );

      -- Tabel Transaksi (Menghubungkan Kategori dan Dompet)
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

    console.log('Database & Tabel berhasil diinisialisasi (Modern API)');
  } catch (error) {
    console.error('Gagal melakukan inisialisasi database:', error);
    throw error; // Meneruskan error agar bisa ditangani di UI
  }
};

// Ekspor instance db untuk operasi CRUD di file lain
export default db;
