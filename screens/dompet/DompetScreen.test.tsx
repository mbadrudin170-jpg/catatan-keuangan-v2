// screens/dompet/DompetScreen.test.tsx

import { NavigationContainer } from '@react-navigation/native';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { useDompet } from '@/context/DompetContext';
import type { Dompet } from '@/database/tipe';
import DompetScreen from './DompetScreen';

// Mock hook useDompet
jest.mock('@/context/DompetContext', () => ({
  useDompet: jest.fn(),
}));

// Data mock untuk daftar dompet
const mockDaftarDompet: Dompet[] = [
  { id: 1, nama: 'Dompet Utama', saldo: 1000000, tipe: 'Reguler', ikon: 'wallet' },
  { id: 2, nama: 'Investasi', saldo: 5000000, tipe: 'Investasi', ikon: 'analytics' },
];

// Fungsi pembungkus dasar untuk navigasi dan safe area
const renderWithNav = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer>{component}</NavigationContainer>
    </SafeAreaProvider>
  );
};

describe('DompetScreen', () => {
  it('harus merender daftar dompet dengan benar', () => {
    (useDompet as jest.Mock).mockReturnValue({ daftarDompet: mockDaftarDompet, memuat: false });
    renderWithNav(<DompetScreen />);

    // Cek berdasarkan data mock
    expect(screen.getByText('Dompet Utama')).toBeTruthy();
    expect(screen.getByText('Rp 1.000.000')).toBeTruthy();
    expect(screen.getByText('Investasi')).toBeTruthy();
    expect(screen.getByText('Rp 5.000.000')).toBeTruthy();
    expect(screen.getByText('Reguler')).toBeTruthy();
    expect(screen.getAllByText('Investasi').length).toBeGreaterThan(0); // Bisa ada di header dan item
  });

  it('harus memiliki tombol untuk menambah dompet baru', () => {
    (useDompet as jest.Mock).mockReturnValue({ daftarDompet: mockDaftarDompet, memuat: false });
    renderWithNav(<DompetScreen />);

    // Pastikan tombol tambah ada di layar
    expect(screen.getByTestId('tombol-tambah-dompet')).toBeTruthy();
  });

  it('harus memiliki gaya latar belakang putih bersih', () => {
    (useDompet as jest.Mock).mockReturnValue({ daftarDompet: mockDaftarDompet, memuat: false });
    renderWithNav(<DompetScreen />);

    // Periksa gaya latar belakang
    const container = screen.getByTestId('dompet-screen-container');
    expect(container.props.style.backgroundColor).toBe('#ffffff');
  });

  it('harus menampilkan pesan saat tidak ada dompet', () => {
    (useDompet as jest.Mock).mockReturnValue({ daftarDompet: [], memuat: false });
    renderWithNav(<DompetScreen />);

    // Pastikan pesan untuk daftar kosong ditampilkan
    expect(screen.getByText('Belum ada dompet.')).toBeTruthy();
  });
});
