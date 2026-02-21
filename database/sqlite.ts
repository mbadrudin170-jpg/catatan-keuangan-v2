import * as SQLite from 'expo-sqlite';

// Gunakan openDatabaseSync untuk API berbasis Promise
export const db = SQLite.openDatabaseSync('catatan_keuangan.db');

// Fungsi untuk mengecek kolom pada tabel
const cekKolom = async (namaTabel: string): Promise<string[]> => {
  try {
    // Dapatkan semua info kolom
    const columnsInfo = await db.getAllAsync(`PRAGMA table_info(${namaTabel});`);
    // Ekstrak hanya nama kolomnya
    return columnsInfo.map((kolom: any) => kolom.name as string);
  } catch (error) {
    // Jika tabel tidak ada atau error lain, kembalikan array kosong
    return [];
  }
};

// Fungsi untuk melakukan migrasi skema database
export const migrasiSkema = async (): Promise<void> => {
  const versiPragma = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  let versiDb = versiPragma?.user_version ?? 0;

  try {
    if (versiDb < 1) {
      // Migrasi awal atau perubahan besar pertama
      console.log('Menjalankan migrasi ke v1...');
      // Tambahkan migrasi spesifik jika perlu, contoh: menambah kolom baru
      const namaKolomKategori = await cekKolom('kategori');
      if (namaKolomKategori.length > 0) {
        if (!namaKolomKategori.includes('ikon')) {
          await db.execAsync('ALTER TABLE kategori ADD COLUMN ikon TEXT;');
        }
      }
      await db.execAsync('PRAGMA user_version = 1');
      versiDb = 1;
    }

    if (versiDb < 2) {
      console.log('Menjalankan migrasi ke v2...');
      const namaKolomTransaksi = await cekKolom('transaksi');
      if (namaKolomTransaksi.length > 0) {
        if (!namaKolomTransaksi.includes('nama_kategori')) {
          await db.execAsync('ALTER TABLE transaksi ADD COLUMN nama_kategori TEXT;');
        }
        if (!namaKolomTransaksi.includes('nama_subkategori')) {
          await db.execAsync('ALTER TABLE transaksi ADD COLUMN nama_subkategori TEXT;');
        }
        if (!namaKolomTransaksi.includes('nama_dompet')) {
          await db.execAsync('ALTER TABLE transaksi ADD COLUMN nama_dompet TEXT;');
        }
        if (!namaKolomTransaksi.includes('nama_dompet_tujuan')) {
          await db.execAsync('ALTER TABLE transaksi ADD COLUMN nama_dompet_tujuan TEXT;');
        }
      }
      await db.execAsync('PRAGMA user_version = 2');
      versiDb = 2;
    }
  } catch (error) {
    console.error('Migrasi skema gagal:', error);
    throw error;
  }
};

export const inisialisasiDB = async (): Promise<void> => {
  try {
    await db.execAsync('PRAGMA foreign_keys = ON;');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS kategori (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL UNIQUE,
        tipe TEXT NOT NULL CHECK(tipe IN ('pemasukan', 'pengeluaran')),
        ikon TEXT
      );

      CREATE TABLE IF NOT EXISTS subkategori (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        kategori_id INTEGER NOT NULL,
        FOREIGN KEY (kategori_id) REFERENCES kategori (id) ON DELETE CASCADE,
        UNIQUE (nama, kategori_id)
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
        tipe TEXT NOT NULL CHECK(tipe IN ('pemasukan', 'pengeluaran', 'transfer')),
        jumlah REAL NOT NULL,
        keterangan TEXT,
        tanggal TEXT NOT NULL,
        kategori_id INTEGER,
        subkategori_id INTEGER,
        dompet_id INTEGER NOT NULL,
        dompet_tujuan_id INTEGER,
        nama_kategori TEXT,
        nama_subkategori TEXT,
        nama_dompet TEXT,
        nama_dompet_tujuan TEXT,
        FOREIGN KEY (kategori_id) REFERENCES kategori (id) ON DELETE SET NULL,
        FOREIGN KEY (subkategori_id) REFERENCES subkategori (id) ON DELETE SET NULL,
        FOREIGN KEY (dompet_id) REFERENCES dompet (id) ON DELETE CASCADE,
        FOREIGN KEY (dompet_tujuan_id) REFERENCES dompet (id) ON DELETE SET NULL
      );
      
      -- Hapus tabel lama untuk pengembangan, ganti dengan sistem migrasi di produksi
      DROP TABLE IF EXISTS anggaran;
      DROP TABLE IF EXISTS rincian_anggaran;

      CREATE TABLE IF NOT EXISTS anggaran (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_anggaran REAL NOT NULL,
        tipe TEXT NOT NULL CHECK(tipe IN ('flat', 'persentase')),
        periode TEXT NOT NULL CHECK(periode IN ('harian', 'mingguan', 'bulanan', 'tahunan', 'sekali')),
        tanggal_mulai TEXT NOT NULL,
        kategori_id INTEGER NOT NULL,
        FOREIGN KEY (kategori_id) REFERENCES kategori (id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS rincian_anggaran (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anggaran_id INTEGER NOT NULL,
        subkategori_id INTEGER NOT NULL,
        jumlah REAL NOT NULL,
        FOREIGN KEY (anggaran_id) REFERENCES anggaran (id) ON DELETE CASCADE,
        FOREIGN KEY (subkategori_id) REFERENCES subkategori (id) ON DELETE CASCADE,
        UNIQUE (anggaran_id, subkategori_id)
      );
    `);

    await migrasiSkema();

    console.log('Database berhasil diinisialisasi.');
  } catch (error) {
    console.error('Inisialisasi database gagal:', error);
    throw error;
  }
};
