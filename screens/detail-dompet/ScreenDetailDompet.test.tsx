
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import DetailDompetHalaman from './ScreenDetailDompet';
import * as LogikaDetailDompet from './logikaDetailDompet';
import * as ExpoRouter from 'expo-router';

// Mocking modul-modul yang diperlukan
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('./logikaDetailDompet', () => ({
  useDetailDompet: jest.fn(),
  DetailDompetProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mocking komponen anak untuk isolasi pengujian
jest.mock('@/screens/detail-dompet/HeaderDetailDompet', () => () => <mock-HeaderDetailDompet />);
jest.mock('@/screens/detail-dompet/KontenDetailDompet', () => () => <mock-KontenDetailDompet />);
jest.mock('./RiwayatTransaksiPerDompet', () => () => <mock-RiwayatTransaksiPerDompet />);
jest.mock('./TombolHapusDetailDompet', () => () => <mock-TombolHapusDetailDompet />);

describe('DetailDompetHalaman', () => {
  beforeEach(() => {
    // Reset mock sebelum setiap pengujian
    (ExpoRouter.useLocalSearchParams as jest.Mock).mockClear();
    (LogikaDetailDompet.useDetailDompet as jest.Mock).mockClear();
  });

  it('menampilkan indikator memuat saat data sedang diambil', () => {
    (ExpoRouter.useLocalSearchParams as jest.Mock).mockReturnValue({ dompetId: '1' });
    (LogikaDetailDompet.useDetailDompet as jest.Mock).mockReturnValue({
      memuat: true,
      dompet: null,
    });

    render(<DetailDompetHalaman />);

    // Harusnya menampilkan ActivityIndicator
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('menampilkan pesan "Dompet tidak ditemukan" jika dompet tidak ada', () => {
    (ExpoRouter.useLocalSearchParams as jest.Mock).mockReturnValue({ dompetId: '99' });
    (LogikaDetailDompet.useDetailDompet as jest.Mock).mockReturnValue({
      memuat: false,
      dompet: null,
    });

    render(<DetailDompetHalaman />);

    // Harusnya menampilkan teks tidak ditemukan
    expect(screen.getByText('Dompet tidak ditemukan.')).toBeTruthy();
  });

  it('menampilkan detail dompet jika data berhasil dimuat', () => {
    const mockDompet = { id: 1, nama: 'Dompet Utama', saldo: 100000 };
    (ExpoRouter.useLocalSearchParams as jest.Mock).mockReturnValue({ dompetId: '1' });
    (LogikaDetailDompet.useDetailDompet as jest.Mock).mockReturnValue({
      memuat: false,
      dompet: mockDompet,
    });

    render(<DetailDompetHalaman />);

    // Harusnya menampilkan semua komponen anak
    expect(screen.getByText('mock-HeaderDetailDompet')).toBeTruthy();
    expect(screen.getByText('mock-KontenDetailDompet')).toBeTruthy();
    expect(screen.getByText('mock-RiwayatTransaksiPerDompet')).toBeTruthy();
    expect(screen.getByText('mock-TombolHapusDetailDompet')).toBeTruthy();
  });
});
