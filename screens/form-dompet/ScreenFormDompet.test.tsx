// screens/form-dompet/ScreenFormDompet.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import HalamanFormDompet from './ScreenFormDompet';
import { useDompet } from '@/context/DompetContext';
import { useLocalSearchParams } from 'expo-router';

// Mocking dependencies
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@/context/DompetContext', () => ({
  useDompet: jest.fn(),
}));

// Mocking komponen anak agar tes tetap ringan
jest.mock('./HeaderFormDompet', () => {
  const { Text } = require('react-native');
  return () => <Text>Header Form Mock</Text>;
});
jest.mock('./InputFormDompet', () => {
  const { Text } = require('react-native');
  return () => <Text>Input Form Mock</Text>;
});
jest.mock('./TombolSimpan', () => {
  const { Text } = require('react-native');
  return () => <Text>Tombol Simpan Mock</Text>;
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('HalamanFormDompet', () => {
  const mockMuatDompet = jest.fn();
  const mockSetFormDompet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDompet as jest.Mock).mockReturnValue({
      muatDompetUntukForm: mockMuatDompet,
      setFormDompet: mockSetFormDompet,
    });
  });

  it('harus meriset form ke kosong jika tidak ada ID (Mode Tambah)', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({}); // Tidak ada ID

    render(<HalamanFormDompet />);

    expect(mockSetFormDompet).toHaveBeenCalledWith({
      nama: '',
      saldo: '',
      tipe: '',
      ikon: '',
    });
  });

  it('harus memuat data dompet jika terdapat ID (Mode Edit)', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '123' });

    render(<HalamanFormDompet />);

    // Memastikan fungsi muat data dipanggil dengan angka 123
    expect(mockMuatDompet).toHaveBeenCalledWith(123);
  });

  it('harus meriset form saat layar ditutup (Cleanup)', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({});

    const { unmount } = render(<HalamanFormDompet />);

    // Simulasikan layar ditutup
    unmount();

    // Pastikan setFormDompet dipanggil lagi oleh fungsi cleanup
    expect(mockSetFormDompet).toHaveBeenCalledTimes(2);
  });
});
