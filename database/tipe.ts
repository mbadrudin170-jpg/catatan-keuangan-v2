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
  kategori_id: number | null;
  subkategori_id: number | null;
  dompet_id: number;
  dompet_tujuan_id: number | null;
  // Salinan nama untuk tujuan historis/arsip.
  nama_kategori?: string | null;
  nama_subkategori?: string | null;
  nama_dompet?: string | null; // BARU
  nama_dompet_tujuan?: string | null; // BARU
}

// Mendefinisikan tipe untuk periode anggaran.
export type TipePeriode = 'bulanan' | 'tahunan' | 'harian' | 'mingguan' | 'sekali';

// --- STRUKTUR ANGGARAN BARU ---

// Tipe untuk anggaran (flat atau persentase).
export type TipeAnggaran = 'flat' | 'persentase';

// Mendefinisikan struktur untuk rincian anggaran per subkategori.
export interface RincianAnggaran {
  id: number;
  anggaran_id: number; // FK ke tabel Anggaran
  subkategori_id: number; // FK ke tabel Subkategori
  jumlah: number; // Jumlah yang dianggarkan untuk subkategori ini
  // Salinan nama untuk kemudahan tampilan
  nama_subkategori?: string;
}

// Mendefinisikan struktur data untuk Anggaran (Induk).
export interface Anggaran {
  id: number;
  total_anggaran: number; // Total dari semua rincian anggaran
  periode: TipePeriode;
  tanggal_mulai: string; // Tanggal awal periode anggaran
  kategori_id: number;
  tipe: TipeAnggaran; // Menggunakan tipe yang sudah didefinisikan
  // Opsional, untuk kemudahan menampilkan nama kategori di UI.
  nama_kategori?: string;
  // Opsional, untuk menampung semua rincian dari tabel RincianAnggaran.
  rincian?: RincianAnggaran[];
}
