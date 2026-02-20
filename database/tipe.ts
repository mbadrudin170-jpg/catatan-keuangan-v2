// database/tipe.ts

// Mendefinisikan struktur data untuk Subkategori.
export interface Subkategori {
  id: number;
  nama: string;
  kategori_id: number; // Foreign key ke tabel kategori
}

// Mendefinisikan tipe transaksi, termasuk 'transfer'.
export type TipeTransaksi = 'pemasukan' | 'pengeluaran' | 'transfer';

// Mendefinisikan tipe khusus untuk kategori.
export type TipeKategori = 'pemasukan' | 'pengeluaran';

// Mendefinisikan struktur data untuk Kategori.
export interface Kategori {
  id: number;
  nama: string;
  ikon?: string;
  tipe: TipeKategori;
  subkategori: Subkategori[];
}

// Mendefinisikan struktur data untuk Dompet.
export interface Dompet {
  id: number;
  nama: string;
  saldo: number;
  tipe?: string;
  ikon?: string;
}

// Mendefinisikan struktur data untuk Transaksi.
export interface Transaksi {
  id: number;
  tipe: TipeTransaksi;
  jumlah: number;
  keterangan?: string;
  tanggal: string;
  kategori_id: number | null; // Bisa NULL untuk tipe 'transfer'
  // DIUBAH: Disesuaikan dengan skema DB (NOT NULL).
  dompet_id: number;
  dompet_tujuan_id: number | null; // Hanya untuk 'transfer', bisa NULL
  subkategori_id: number | null; // Bisa NULL
}
