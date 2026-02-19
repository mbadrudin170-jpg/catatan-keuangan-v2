// database/tipe.ts

// Mendefinisikan struktur data untuk Subkategori.
// Ini memiliki tabel sendiri dan terhubung ke tabel Kategori.
export interface Subkategori {
  id: number;
  nama: string;
  kategori_id: number; // Foreign key ke tabel kategori
}

// DIUBAH: Mendefinisikan tipe transaksi, sekarang termasuk 'transfer'.
export type TipeTransaksi = 'pemasukan' | 'pengeluaran' | 'transfer';

// Mendefinisikan struktur data untuk Kategori agar sesuai dengan skema DB.
export interface Kategori {
  id: number; // Sesuai dengan INTEGER PRIMARY KEY AUTOINCREMENT
  nama: string;
  ikon?: string; // Opsional agar sesuai dengan skema DB (bisa NULL)
  // DIUBAH: Kategori hanya bisa untuk pemasukan atau pengeluaran.
  tipe: 'pemasukan' | 'pengeluaran';
  subkategori: Subkategori[]; // Daftar subkategori yang dimiliki
}

// Mendefinisikan struktur data untuk Dompet agar sesuai dengan skema DB.
export interface Dompet {
  id: number; // Sesuai dengan INTEGER PRIMARY KEY AUTOINCREMENT
  nama: string;
  saldo: number; // Sesuai dengan REAL
  tipe?: string; // Opsional agar sesuai dengan skema DB (bisa NULL)
  ikon?: string; // Opsional agar sesuai dengan skema DB (bisa NULL)
}

// Mendefinisikan struktur data untuk Transaksi agar sesuai dengan skema DB.
export interface Transaksi {
  id: number; // Sesuai dengan INTEGER PRIMARY KEY AUTOINCREMENT
  tipe: TipeTransaksi; // BARU: Menentukan tipe dari transaksi
  jumlah: number; // Sesuai dengan REAL NOT NULL
  keterangan?: string; // Sesuai dengan TEXT (opsional)
  tanggal: string; // Sesuai dengan TEXT NOT NULL
  kategori_id: number | null; // Bisa NULL, terutama untuk tipe 'transfer'
  dompet_id: number; // Harus ada (dompet asal)
  dompet_tujuan_id: number | null; // BARU: Dompet tujuan (hanya untuk 'transfer')
  subkategori_id: number | null; // Foreign key ke tabel subkategori, bisa NULL
}
