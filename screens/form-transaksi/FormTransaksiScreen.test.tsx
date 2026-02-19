// screens/form-transaksi/FormTransaksiScreen.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import FormTransaksiScreen from './FormTransaksiScreen';

// Mocking komponen anak agar tes fokus pada struktur Screen utama
jest.mock('./HeaderFormTransaksi', () => {
  const { Text } = require('react-native');
  return () => <Text>Header Form Transaksi Mock</Text>;
});

jest.mock('./InputFormTransaksi', () => {
  const { Text } = require('react-native');
  return () => <Text>Input Form Transaksi Mock</Text>;
});

jest.mock('./tombol/TombolTipeFormTransaksi', () => {
  const { Text } = require('react-native');
  return () => <Text>Tombol Tipe Mock</Text>;
});

jest.mock('./tombol/TombolSimpanFormTransaksi', () => {
  const { Text } = require('react-native');
  return () => <Text>Tombol Simpan Mock</Text>;
});

// Mocking modal (manajemen state kini di context, jadi kita hanya cek kehadirannya)
jest.mock('./modal/ModalPilihKategori', () => {
  const { Text } = require('react-native');
  return () => <Text>Modal Kategori Mock</Text>;
});

jest.mock('./modal/ModalPilihDompet', () => {
  const { Text } = require('react-native');
  return () => <Text>Modal Dompet Mock</Text>;
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('FormTransaksiScreen', () => {
  it('harus merender seluruh elemen formulir transaksi dengan benar', () => {
    const { getByText } = render(<FormTransaksiScreen />);

    // Memastikan elemen navigasi dan input muncul
    expect(getByText('Header Form Transaksi Mock')).toBeTruthy();
    expect(getByText('Tombol Tipe Mock')).toBeTruthy();
    expect(getByText('Input Form Transaksi Mock')).toBeTruthy();
    expect(getByText('Tombol Simpan Mock')).toBeTruthy();
  });

  it('harus menyertakan komponen modal kategori dan dompet di dalam layar', () => {
    const { getByText } = render(<FormTransaksiScreen />);

    // Memastikan modal sudah terpasang (meskipun status terlihat/tidaknya diatur context)
    expect(getByText('Modal Kategori Mock')).toBeTruthy();
    expect(getByText('Modal Dompet Mock')).toBeTruthy();
  });

  it('harus memiliki struktur ScrollView untuk area konten', () => {
    const { toJSON } = render(<FormTransaksiScreen />);
    const json = toJSON() as any;

    // Mencari keberadaan ScrollView dalam pohon komponen
    // Dalam JSON render, ScrollView biasanya terdeteksi melalui propsnya
    const hasScrollView = JSON.stringify(json).includes('ScrollView');
    expect(hasScrollView).toBe(true);
  });
});
