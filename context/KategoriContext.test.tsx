// context/KategoriContext.test.tsx

import React from 'react';
import {
  renderHook,
  waitFor,
  act,
} from '@testing-library/react-native';
import { KategoriProvider, useKategori } from './KategoriContext';
import * as dbOps from '@/database/operasi';

// Mocking semua operasi database
jest.mock('@/database/operasi', () => ({
  ambilSemuaKategori: jest.fn(),
  tambahKategori: jest.fn(),
  hapusKategori: jest.fn(),
  tambahSubkategori: jest.fn(),
  hapusSubkategori: jest.fn(),
  perbaruiKategori: jest.fn(),
  perbaruiSubkategori: jest.fn(),
}));

describe('KategoriContext', () => {
  const dataKategoriPalsu = [
    { id: 1, nama: 'Internet', ikon: 'wifi', tipe: 'pengeluaran', subkategori: [] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (dbOps.ambilSemuaKategori as jest.Mock).mockResolvedValue(dataKategoriPalsu);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <KategoriProvider>{children}</KategoriProvider>
  );

  it('harus memuat kategori saat pertama kali dijalankan (initial load)', async () => {
    renderHook(() => useKategori(), { wrapper });

    await waitFor(() => {
      expect(dbOps.ambilSemuaKategori).toHaveBeenCalledTimes(1);
    });
  });

  it('harus memanggil fungsi tambahKategori dan menyegarkan data', async () => {
    const { result } = renderHook(() => useKategori(), { wrapper });

    // Menunggu pemuatan awal selesai
    await waitFor(() => expect(dbOps.ambilSemuaKategori).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.tambahKategori('Listrik', 'flash', 'pengeluaran');
    });

    expect(dbOps.tambahKategori).toHaveBeenCalledWith('Listrik', 'flash', 'pengeluaran');
    // Data dimuat ulang setelah tambah (initial + refresh)
    expect(dbOps.ambilSemuaKategori).toHaveBeenCalledTimes(2);
  });

  it('harus mengganti tipe aktif dengan benar', async () => {
    const { result } = renderHook(() => useKategori(), { wrapper });

    // Menunggu pemuatan awal
    await waitFor(() => expect(result.current.daftarKategori).not.toBeNull());

    act(() => {
      result.current.setTipeAktif('pemasukan');
    });

    expect(result.current.tipeAktif).toBe('pemasukan');
  });

  it('harus memanggil hapusSubkategori tanpa memerlukan idKategori', async () => {
    const { result } = renderHook(() => useKategori(), { wrapper });

    // Menunggu pemuatan awal
    await waitFor(() => expect(dbOps.ambilSemuaKategori).toHaveBeenCalledTimes(1));

    await act(async () => {
      // 999 adalah _idKategori yang diabaikan
      await result.current.hapusSubkategori(999, 10);
    });

    expect(dbOps.hapusSubkategori).toHaveBeenCalledWith(10);
    // Pastikan data dimuat ulang
    expect(dbOps.ambilSemuaKategori).toHaveBeenCalledTimes(2);
  });
});
