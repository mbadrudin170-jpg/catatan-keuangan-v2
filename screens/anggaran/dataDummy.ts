// screens/anggaran/dataDummy.ts

/**
 * @interface Anggaran
 * @description Mendefinisikan struktur objek untuk data anggaran.
 */
export interface AnggaranLokal {
  id: number;
  kategori_id: number;
  nama_kategori: string;
  jumlah: number;
  subKategori: string;
  periode: 'bulanan' | 'tahunan' | 'harian' | 'mingguan';
  tanggal_mulai: string;
  harian: '';
}

// Data dummy untuk digunakan dalam pengembangan dan pengujian antarmuka.
export const dataDummyAnggaran: AnggaranLokal[] = [
  {
    id: 1,
    kategori_id: 1,
    nama_kategori: 'Makanan & Minuman',
    jumlah: 1500000,
    periode: 'bulanan',
    tanggal_mulai: '2024-07-01',
    subKategori: '',
    harian: '',
  },
  {
    id: 2,
    kategori_id: 2,
    nama_kategori: 'Transportasi',
    jumlah: 750000,
    periode: 'bulanan',
    tanggal_mulai: '2024-07-01',
    subKategori: '',
    harian: '',
  },
  {
    id: 3,
    kategori_id: 5,
    nama_kategori: 'Pendidikan',
    jumlah: 5000000,
    periode: 'tahunan',
    tanggal_mulai: '2024-01-01',
    subKategori: '',
    harian: '',
  },
  {
    id: 4,
    kategori_id: 10,
    nama_kategori: 'Liburan',
    jumlah: 2000000,
    periode: 'harian',
    tanggal_mulai: '2024-12-01',
    subKategori: '',
    harian: '',
  },
];
