// screens/form-kategori/FormKategoriScreen.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormKategoriScreen from './FormKategoriScreen';
import { useKategori } from '@/context/KategoriContext';
import { Alert } from 'react-native';

// Mocking context
jest.mock('@/context/KategoriContext', () => ({
  useKategori: jest.fn(),
}));

// Mocking komponen anak
jest.mock('./HeaderFormKategori', () => {
  const { Text } = require('react-native');
  return () => <Text>Header Form Kategori Mock</Text>;
});

jest.mock('./ListKategori', () => {
  const { Text } = require('react-native');
  return () => <Text>List Kategori Mock</Text>;
});

jest.mock('./ListSubKategori', () => {
  const { Text } = require('react-native');
  return () => <Text>List SubKategori Mock</Text>;
});

jest.mock('./TombolSimpan', () => {
  const { Button } = require('react-native');
  return ({ onPress }: { onPress: () => void }) => <Button title="Simpan Mock" onPress={onPress} />;
});

jest.mock('./TombolTipe', () => {
  const { Text } = require('react-native');
  return () => <Text>Tombol Tipe Mock</Text>;
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('FormKategoriScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('harus menampilkan ListKategori jika tipeAktif adalah pengeluaran', () => {
    (useKategori as jest.Mock).mockReturnValue({ tipeAktif: 'pengeluaran' });

    const { queryByText } = render(<FormKategoriScreen />);

    expect(queryByText('List Kategori Mock')).toBeTruthy();
  });

  it('harus menyembunyikan ListKategori jika tipeAktif adalah transfer', () => {
    (useKategori as jest.Mock).mockReturnValue({ tipeAktif: 'transfer' });

    const { queryByText } = render(<FormKategoriScreen />);

    // queryByText akan menghasilkan null jika tidak ditemukan (bagus untuk mengecek ketidakhadiran)
    expect(queryByText('List Kategori Mock')).toBeNull();
  });

  it('harus menampilkan Alert saat tombol simpan ditekan', () => {
    (useKategori as jest.Mock).mockReturnValue({ tipeAktif: 'pengeluaran' });

    const { getByText } = render(<FormKategoriScreen />);
    const tombolSimpan = getByText('Simpan Mock');

    fireEvent.press(tombolSimpan);

    expect(Alert.alert).toHaveBeenCalledWith('Simpan', 'Tombol Simpan Ditekan!');
  });
});
