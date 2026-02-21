/**
 * @interface SubKategoriDetail
 * @description Mendefinisikan struktur untuk setiap sub-kategori anggaran.
 */
export interface SubKategoriDetail {
  nama: string;
  jumlah: number;
  terpakai: number;
  sisa: number;
}

/**
 * @interface AnggaranLokal
 * @description Mendefinisikan struktur objek untuk data anggaran utama.
 */
export interface AnggaranLokal {
  id: number;
  kategori_id: number;
  nama_kategori: string;
  jumlah: number;
  subKategori: SubKategoriDetail[];
  periode: 'bulanan' | 'tahunan' | 'harian' | 'mingguan';
  tanggal_mulai: string;
  harian: '';
  terpakai: number;
  sisa: number;
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
    subKategori: [
      { nama: 'Belanja Bahan Pokok', jumlah: 800000, terpakai: 300000, sisa: 500000 },
      { nama: 'Jajan di Luar', jumlah: 500000, terpakai: 200000, sisa: 300000 },
      { nama: 'Kopi & Minuman', jumlah: 200000, terpakai: 0, sisa: 200000 },
    ],
    harian: '',
    terpakai: 500000,
    sisa: 1000000,
  },
  {
    id: 2,
    kategori_id: 2,
    nama_kategori: 'Transportasi',
    jumlah: 750000,
    periode: 'bulanan',
    tanggal_mulai: '2024-07-01',
    subKategori: [
      { nama: 'Bensin Motor', jumlah: 350000, terpakai: 150000, sisa: 200000 },
      { nama: 'Servis Rutin', jumlah: 250000, terpakai: 100000, sisa: 150000 },
      { nama: 'Parkir & Tol', jumlah: 150000, terpakai: 0, sisa: 150000 },
      { nama: 'Biaya Tak Terduga', jumlah: 0, terpakai: 50000, sisa: -50000 },
    ],
    harian: '',
    terpakai: 300000,
    sisa: 450000,
  },
  {
    id: 3,
    kategori_id: 5,
    nama_kategori: 'Pendidikan',
    jumlah: 5000000,
    periode: 'tahunan',
    tanggal_mulai: '2024-01-01',
    subKategori: [
      { nama: 'Uang Sekolah Anak', jumlah: 4500000, terpakai: 4000000, sisa: 500000 },
      { nama: 'Buku & Alat Tulis', jumlah: 300000, terpakai: 0, sisa: 300000 },
      { nama: 'Kursus Tambahan', jumlah: 200000, terpakai: 0, sisa: 200000 },
    ],
    harian: '',
    terpakai: 4000000,
    sisa: 1000000,
  },
  {
    id: 4,
    kategori_id: 10,
    nama_kategori: 'Liburan',
    jumlah: 2000000,
    periode: 'harian',
    tanggal_mulai: '2024-12-01',
    subKategori: [
      { nama: 'Akomodasi Hotel', jumlah: 1000000, terpakai: 0, sisa: 1000000 },
      { nama: 'Transportasi Liburan', jumlah: 500000, terpakai: 0, sisa: 500000 },
      { nama: 'Makan & Oleh-oleh', jumlah: 500000, terpakai: 0, sisa: 500000 },
    ],
    harian: '',
    terpakai: 0,
    sisa: 2000000,
  },
];
