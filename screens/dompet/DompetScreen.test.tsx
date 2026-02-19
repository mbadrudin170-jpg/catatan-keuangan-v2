// screens/dompet/DompetScreen.test.tsx
import { NavigationContainer } from '@react-navigation/native';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { useDompet } from '@/context/DompetContext';
import type { Dompet } from '@/database/tipe';
import DompetScreen from './DompetScreen';

jest.mock('@/context/DompetContext', () => ({
  useDompet: jest.fn(),
}));

const mockDaftarDompet: Dompet[] = [
  { id: 1, nama: 'Dompet Utama', saldo: 1000000, tipe: 'Reguler', ikon: 'wallet' },
  { id: 2, nama: 'Investasi', saldo: 5000000, tipe: 'Investasi', ikon: 'analytics' },
];

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

    expect(screen.getByText('Dompet Utama')).toBeTruthy();
    // Gunakan getAllByText karena angka ini bisa muncul di total saldo dan item
    expect(screen.getAllByText('1.000.000').length).toBeGreaterThan(0);
    expect(screen.getByText('Investasi')).toBeTruthy();
    expect(screen.getByText('5.000.000')).toBeTruthy();
    expect(screen.getByText('Reguler')).toBeTruthy();
  });

  it('harus memiliki tombol untuk menambah dompet baru', () => {
    (useDompet as jest.Mock).mockReturnValue({ daftarDompet: mockDaftarDompet, memuat: false });
    renderWithNav(<DompetScreen />);
    expect(screen.getByTestId('tombol-tambah-dompet')).toBeTruthy();
  });

  it('harus memiliki gaya latar belakang putih bersih', () => {
    (useDompet as jest.Mock).mockReturnValue({ daftarDompet: mockDaftarDompet, memuat: false });
    renderWithNav(<DompetScreen />);
    const container = screen.getByTestId('dompet-screen-container');
    expect(container.props.style.backgroundColor).toBe('#ffffff');
  });

  it('harus menampilkan pesan saat tidak ada dompet', () => {
    (useDompet as jest.Mock).mockReturnValue({ daftarDompet: [], memuat: false });
    renderWithNav(<DompetScreen />);
    expect(screen.getByText('Belum ada dompet.')).toBeTruthy();
  });
});
