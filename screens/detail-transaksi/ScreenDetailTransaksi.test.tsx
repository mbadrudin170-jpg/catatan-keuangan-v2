// screens/detail-transaksi/ScreenDetailTransaksi.test.tsx

import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import { render } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import ScreenDetailTransaksi from './ScreenDetailTransaksi';

// Mocking Expo Router dan Context agar kita bisa mengontrol datanya
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@/context/TransaksiContext', () => ({
  useTransaksi: jest.fn(),
}));

jest.mock('@/context/KategoriContext', () => ({
  useKategori: jest.fn(),
}));

jest.mock('@/context/DompetContext', () => ({
  useDompet: jest.fn(),
}));

describe('ScreenDetailTransaksi', () => {
  // Data palsu untuk pengujian
  const dataTransaksiPalsu = [
    {
      id: 1,
      jumlah: 50000,
      keterangan: 'Beli Kopi',
      tanggal: '2026-02-20T10:00:00.000Z',
      tipe: 'pengeluaran',
      kategori_id: 101,
      dompet_id: 1,
    },
  ];

  const dataKategoriPalsu = [
    {
      id: 1,
      nama: 'Makanan',
      subkategori: [{ id: 101, nama: 'Kopi', kategori_id: 1 }],
    },
  ];

  const dataDompetPalsu = [{ id: 1, nama: 'Dompet Utama' }];

  beforeEach(() => {
    // Reset semua mock sebelum setiap tes
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    (useTransaksi as jest.Mock).mockReturnValue({ daftarTransaksi: dataTransaksiPalsu });
    (useKategori as jest.Mock).mockReturnValue({ daftarKategori: dataKategoriPalsu });
    (useDompet as jest.Mock).mockReturnValue({ daftarDompet: dataDompetPalsu });
  });

  it('harus menampilkan detail transaksi dengan benar', () => {
    const { getByText } = render(<ScreenDetailTransaksi />);

    // Cek apakah nominal muncul (formatAngka mungkin menghasilkan Rp 50.000)
    // Gunakan regex agar lebih fleksibel dengan spasi/simbol
    expect(getByText(/50\.000/)).toBeTruthy();

    // Cek keterangan
    expect(getByText('Beli Kopi')).toBeTruthy();

    // Cek kategori dan dompet
    expect(getByText('Kopi')).toBeTruthy();
    expect(getByText('Dompet Utama')).toBeTruthy();
  });

  it('harus menampilkan pesan error jika transaksi tidak ditemukan', () => {
    // Paksa ID yang dicari tidak ada di data palsu
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '999' });

    const { getByText } = render(<ScreenDetailTransaksi />);

    expect(getByText('Transaksi tidak ditemukan.')).toBeTruthy();
  });

  it('harus menampilkan tanda minus (-) untuk tipe pengeluaran', () => {
    const { getByText } = render(<ScreenDetailTransaksi />);

    // Mencari teks yang mengandung tanda minus dan angka
    expect(getByText(/-.*50\.000/)).toBeTruthy();
  });
});
