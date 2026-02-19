// database/tipe.ts

// Mendefinisikan struktur data untuk Subkategori, yang merupakan bagian dari Kategori di sisi klien.
// Ini tidak memiliki tabel sendiri di database.
export interface Subkategori {
  id: number;
  nama: string;
}

// Mendefinisikan tipe transaksi agar sesuai dengan CHECK constraint di database.
// Nama 'pemasukan' dan 'pengeluaran' (huruf kecil) harus cocok dengan skema DB.
export type TipeTransaksi = 'pemasukan' | 'pengeluaran';

// Mendefinisikan struktur data untuk Kategori agar sesuai dengan skema DB.
export interface Kategori {
  id: number; // Sesuai dengan INTEGER PRIMARY KEY AUTOINCREMENT
  nama: string;
  ikon?: string; // Diubah menjadi opsional agar sesuai dengan skema DB (bisa NULL)
  tipe: TipeTransaksi;
  subkategori?: Subkategori[]; // Untuk kebutuhan logika aplikasi, bukan dari DB langsung
}

// Mendefinisikan struktur data untuk Dompet agar sesuai dengan skema DB.
export interface Dompet {
  id: number; // Sesuai dengan INTEGER PRIMARY KEY AUTOINCREMENT
  nama: string;
  saldo: number; // Sesuai dengan REAL
  tipe?: string; // Diubah menjadi opsional agar sesuai dengan skema DB (bisa NULL)
  ikon?: string; // Diubah menjadi opsional agar sesuai dengan skema DB (bisa NULL)
}

// Mendefinisikan struktur data untuk Transaksi agar sesuai dengan skema DB.
export interface Transaksi {
  id: number; // Sesuai dengan INTEGER PRIMARY KEY AUTOINCREMENT
  jumlah: number; // Sesuai dengan REAL NOT NULL
  keterangan?: string; // Sesuai dengan TEXT (opsional)
  tanggal: string; // Sesuai dengan TEXT NOT NULL
  kategori_id: number | null; // Sesuai dengan INTEGER, bisa NULL
  dompet_id: number; // Sesuai dengan INTEGER, harus ada
}
