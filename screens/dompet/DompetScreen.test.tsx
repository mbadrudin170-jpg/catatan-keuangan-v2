// screens/dompet/DompetScreen.test.tsx

import { NavigationContainer } from '@react-navigation/native';
import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { DompetProvider } from '@/context/DompetContext';
import DompetScreen from './DompetScreen'; // Nama file yang benar

// Mocking database
jest.mock('@/database/operasi', () => ({
  ambilSemuaDompet: jest.fn().mockResolvedValue([
    { id: 1, nama: 'Dompet Utama', saldo: 1000000 },
    { id: 2, nama: 'Investasi', saldo: 5000000 },
  ]),
}));

// Fungsi pembungkus untuk provider dan navigasi
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer>
        <DompetProvider>{component}</DompetProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

describe('DompetScreen', () => {
  it('harus merender daftar dompet setelah dimuat', async () => {
    renderWithProviders(<DompetScreen />);

    // Tunggu hingga daftar dompet muncul
    await waitFor(() => {
      expect(screen.getByText('Dompet Utama')).toBeTruthy();
      expect(screen.getByText('Rp 1.000.000')).toBeTruthy();
      expect(screen.getByText('Investasi')).toBeTruthy();
      expect(screen.getByText('Rp 5.000.000')).toBeTruthy();
    });
  });

  it('harus memiliki tombol untuk menambah dompet baru', async () => {
    renderWithProviders(<DompetScreen />);

    // Pastikan tombol tambah ada di layar
    await waitFor(() => {
      expect(screen.getByTestId('tombol-tambah-dompet')).toBeTruthy();
    });
  });

  it('harus memiliki gaya latar belakang putih bersih', async () => {
    renderWithProviders(<DompetScreen />);

    // Periksa gaya latar belakang
    await waitFor(() => {
      const container = screen.getByTestId('dompet-screen-container');
      expect(container.props.style.backgroundColor).toBe('#ffffff');
    });
  });
});
