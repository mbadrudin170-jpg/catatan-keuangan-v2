// screens/anggaran/dataDummy.ts

// Definisikan struktur detail untuk setiap sub-kategori dalam sebuah anggaran.
// Ini digunakan di dalam form untuk melacak input pengguna.
export interface SubKategoriDetail {
  subkategori_id: number; // ID subkategori untuk referensi database (BARU)
  nama: string;
  jumlah: number; // Jumlah yang dianggarkan (bisa flat atau persentase)
  terpakai: number; // Jumlah yang sudah digunakan
  sisa: number; // Sisa anggaran
}

// Definisikan struktur sub-kategori dasar.
export interface SubKategori {
  id: number;
  nama: string;
}

// Definisikan struktur data anggaran lokal yang digunakan di UI,
// terutama untuk memilih kategori di form anggaran.
export interface AnggaranLokal {
  id: number; // Ini adalah ID KATEGORI
  nama_kategori: string;
  total_anggaran: number;
  terpakai: number;
  sisa: number;
  periode: 'bulanan' | 'tahunan';
  subKategori: SubKategori[]; // Daftar sub-kategori di bawah kategori ini
}

// Data dummy untuk daftar anggaran yang bisa dipilih pengguna.
export const daftarAnggaranLokal: AnggaranLokal[] = [
  {
    id: 1,
    nama_kategori: 'Kebutuhan Pokok',
    total_anggaran: 5000000,
    terpakai: 2500000,
    sisa: 2500000,
    periode: 'bulanan',
    subKategori: [
      { id: 1, nama: 'Belanja Bulanan' },
      { id: 2, nama: 'Tagihan Listrik' },
      { id: 3, nama: 'Transportasi' },
    ],
  },
  {
    id: 2,
    nama_kategori: 'Hiburan',
    total_anggaran: 1000000,
    terpakai: 750000,
    sisa: 250000,
    periode: 'bulanan',
    subKategori: [
      { id: 4, nama: 'Langganan Streaming' },
      { id: 5, nama: 'Makan di Luar' },
      { id: 6, nama: 'Nonton Bioskop' },
    ],
  },
  {
    id: 3,
    nama_kategori: 'Pendidikan',
    total_anggaran: 12000000,
    terpakai: 10000000,
    sisa: 2000000,
    periode: 'tahunan',
    subKategori: [
      { id: 7, nama: 'Uang Sekolah' },
      { id: 8, nama: 'Buku & Alat Tulis' },
    ],
  },
];
