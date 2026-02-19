// screens/transaksi/TransaksiScreen.test.tsx

import { NavigationContainer } from '@react-navigation/native';
import { render, waitFor, screen } from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DompetProvider } from '@/context/DompetContext';
import { KategoriProvider } from '@/context/KategoriContext';
import { TransaksiProvider } from '@/context/TransaksiContext';
import TransaksiScreen from './TransaksiScreen';

// Mocking database
jest.mock('@/database/operasi', () => ({
  ambilSemuaTransaksi: jest.fn().mockResolvedValue([
    {
      id: 1,
      id_kategori: 1,
      id_dompet: 1,
      nama: 'Gaji Bulanan',
      jumlah: 5000000,
      tipe: 'pemasukan',
      tanggal: '2023-10-26',
    },
  ]),
  ambilSemuaDompet: jest.fn().mockResolvedValue([]),
  ambilSemuaKategori: jest.fn().mockResolvedValue([]),
}));

// Fungsi pembungkus untuk provider dan navigasi
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider>
      <NavigationContainer>
        <DompetProvider>
          <KategoriProvider>
            <TransaksiProvider>{component}</TransaksiProvider>
          </KategoriProvider>
        </DompetProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

describe('TransaksiScreen', () => {
  it('harus merender daftar transaksi setelah dimuat', async () => {
    renderWithProviders(<TransaksiScreen />);

    // Menunggu hingga transaksi dirender
    await waitFor(() => {
      expect(screen.getByText('Gaji Bulanan')).toBeTruthy();
      expect(screen.getByText('Rp5.000.000')).toBeTruthy();
    });
  });

  it('harus memiliki tombol untuk menambah transaksi baru', async () => {
    renderWithProviders(<TransaksiScreen />);

    // Menunggu hingga komponen selesai render
    await waitFor(() => {
      // Tombol tambah memiliki `testID` untuk memudahkan pengujian
      expect(screen.getByTestId('tombol-tambah-transaksi')).toBeTruthy();
    });
  });

  it('harus memiliki gaya latar belakang putih bersih', async () => {
    renderWithProviders(<TransaksiScreen />);

    await waitFor(() => {
      const container = screen.getByTestId('transaksi-screen-container');
      expect(container.props.style.backgroundColor).toBe('#fff');
    });
  });
});
