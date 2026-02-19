// screens/kategori/KategoriScreen.test.tsx

import React, { ReactElement } from 'react';
import { render, waitFor } from '@testing-library/react-native';
import KategoriScreen from './KategoriScreen';
import { KategoriProvider } from '@/context/KategoriContext';

// Mocking database karena KategoriProvider akan memanggilnya
jest.mock('@/database/operasi', () => ({
  ambilSemuaKategori: jest.fn().mockResolvedValue([]),
}));

// Mocking komponen anak agar pengujian fokus pada struktur utama layar
jest.mock('@/screens/kategori/HeaderKategori', () => {
  const { Text } = require('react-native');
  return () => <Text>Header Kategori Mock</Text>;
});

jest.mock('@/screens/kategori/TombolTipe', () => {
  const { Text } = require('react-native');
  return () => <Text>Tombol Tipe Mock</Text>;
});

jest.mock('@/screens/kategori/ListKategori', () => {
  const { Text } = require('react-native');
  return () => <Text>Daftar Kategori Mock</Text>;
});

jest.mock('@/screens/kategori/TombolTambahKategori', () => {
  const { Text } = require('react-native');
  return () => <Text>Tombol Tambah Kategori Mock</Text>;
});

// Mocking SafeAreaView untuk menghindari masalah layout di lingkungan test
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }: { children: React.ReactNode; style: any }) => (
      <View style={style}>{children}</View>
    ),
  };
});

const renderWithProvider = (component: ReactElement) => {
  return render(<KategoriProvider>{component}</KategoriProvider>);
};

describe('KategoriScreen', () => {
  it('harus merender seluruh elemen layar kategori dengan benar', async () => {
    const { findByText } = renderWithProvider(<KategoriScreen />);

    // findBy* sudah secara otomatis menggunakan waitFor
    expect(await findByText('Header Kategori Mock')).toBeTruthy();
    expect(await findByText('Tombol Tipe Mock')).toBeTruthy();
    expect(await findByText('Daftar Kategori Mock')).toBeTruthy();
    expect(await findByText('Tombol Tambah Kategori Mock')).toBeTruthy();
  });

  it('harus memiliki area konten dengan padding yang sesuai', async () => {
    const { getByTestId } = renderWithProvider(<KategoriScreen />);

    // Menunggu render selesai sebelum mengambil elemen
    await waitFor(() => expect(getByTestId('konten-utama')).toBeTruthy());

    const kontenUtama = getByTestId('konten-utama');
    const gayaKonten = kontenUtama.props.style;

    // Memeriksa properti gaya
    expect(gayaKonten.paddingHorizontal).toBe(20);
    expect(gayaKonten.paddingTop).toBe(16);
  });
});
