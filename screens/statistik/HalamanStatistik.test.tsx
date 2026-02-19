// screens/statistik/HalamanStatistik.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { HalamanStatistik } from './HalamanStatistik';

// Mocking komponen anak untuk isolasi pengujian
jest.mock('./HeaderStatistik', () => {
  const { Text } = require('react-native');
  return { HeaderStatistik: () => <Text>Header Statistik Mock</Text> };
});

jest.mock('./FilterPeriode', () => {
  const { Text } = require('react-native');
  return { FilterPeriode: () => <Text>Filter Periode Mock</Text> };
});

jest.mock('./RingkasanKeuangan', () => {
  const { Text } = require('react-native');
  return { RingkasanKeuangan: () => <Text>Ringkasan Keuangan Mock</Text> };
});

jest.mock('./RingkasanKategori', () => {
  const { Text } = require('react-native');
  return { RingkasanKategori: () => <Text>Ringkasan Kategori Mock</Text> };
});

jest.mock('./RingkasanDompet', () => {
  const { Text } = require('react-native');
  return { RingkasanDompet: () => <Text>Ringkasan Dompet Mock</Text> };
});

jest.mock('./TransaksiTerakhir', () => {
  const { Text } = require('react-native');
  return { TransaksiTerakhir: () => <Text>Transaksi Terakhir Mock</Text> };
});

// Mocking Provider agar tidak menjalankan logika database asli
jest.mock('./StatistikContext', () => ({
  StatistikProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('HalamanStatistik', () => {
  it('harus merender seluruh modul ringkasan statistik dengan benar', () => {
    const { getByText } = render(<HalamanStatistik />);

    // Memastikan struktur utama muncul
    expect(getByText('Header Statistik Mock')).toBeTruthy();
    expect(getByText('Filter Periode Mock')).toBeTruthy();

    // Memastikan semua kartu ringkasan dirender
    expect(getByText('Ringkasan Keuangan Mock')).toBeTruthy();
    expect(getByText('Ringkasan Kategori Mock')).toBeTruthy();
    expect(getByText('Ringkasan Dompet Mock')).toBeTruthy();
    expect(getByText('Transaksi Terakhir Mock')).toBeTruthy();
  });

  it('harus menggunakan ScrollView agar konten dapat digulir', () => {
    const { toJSON } = render(<HalamanStatistik />);
    const json = JSON.stringify(toJSON());

    // Memastikan komponen ScrollView ada dalam struktur pohon render
    expect(json.includes('ScrollView')).toBe(true);
  });
});
