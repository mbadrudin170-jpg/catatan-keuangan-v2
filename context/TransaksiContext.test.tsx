// context/TransaksiContext.test.tsx

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { TransaksiProvider, useTransaksi } from './TransaksiContext';
import { useDompet } from './DompetContext';
import { tambahSatuTransaksi } from '@/database/operasi';
import { Alert } from 'react-native';

// Mocking dependencies
jest.mock('./DompetContext', () => ({
  useDompet: jest.fn(),
}));

jest.mock('@/database/operasi', () => ({
  tambahSatuTransaksi: jest.fn(),
}));

// Mock Alert agar tidak muncul popup sungguhan saat tes
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('TransaksiContext', () => {
  const mockTambahPemasukan = jest.fn();
  const mockTambahPengeluaran = jest.fn();
  const mockTambahTransfer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDompet as jest.Mock).mockReturnValue({
      tambahPemasukan: mockTambahPemasukan,
      tambahPengeluaran: mockTambahPengeluaran,
      tambahTransfer: mockTambahTransfer,
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransaksiProvider>{children}</TransaksiProvider>
  );

  it('harus menolak transaksi jika jumlahnya nol atau negatif', async () => {
    const { result } = renderHook(() => useTransaksi(), { wrapper });

    const transaksiSalah = {
      id: 1,
      jumlah: 0,
      keterangan: 'Tes',
      tanggal: new Date().toISOString(),
      tipe: 'pengeluaran',
      dompet_id: 1,
      kategori_id: null,
      dompet_tujuan_id: null,
      subkategori_id: null,
    } as any;

    await expect(act(() => result.current.tambahTransaksi(transaksiSalah))).rejects.toThrow(
      'Jumlah transaksi tidak valid.'
    );

    expect(Alert.alert).toHaveBeenCalledWith('Input Tidak Valid', expect.any(String));
  });

  it('harus memanggil fungsi tambahPengeluaran saat tipe transaksi adalah pengeluaran', async () => {
    const { result } = renderHook(() => useTransaksi(), { wrapper });

    const transaksiPengeluaran = {
      id: 1,
      jumlah: 50000,
      keterangan: 'Beli Makan',
      tanggal: new Date().toISOString(),
      tipe: 'pengeluaran',
      dompet_id: 10,
      kategori_id: 1,
      dompet_tujuan_id: null,
      subkategori_id: null,
    } as any;

    await act(async () => {
      await result.current.tambahTransaksi(transaksiPengeluaran);
    });

    // Pastikan masuk ke database
    expect(tambahSatuTransaksi).toHaveBeenCalled();
    // Pastikan saldo dompet dikurangi
    expect(mockTambahPengeluaran).toHaveBeenCalledWith(10, 50000);
  });

  it('harus memvalidasi bahwa dompet sumber dan tujuan transfer tidak boleh sama', async () => {
    const { result } = renderHook(() => useTransaksi(), { wrapper });

    const transaksiTransferSama = {
      id: 2,
      jumlah: 100000,
      tipe: 'transfer',
      dompet_id: 1,
      dompet_tujuan_id: 1, // Sama dengan sumber
    } as any;

    await expect(act(() => result.current.tambahTransaksi(transaksiTransferSama))).rejects.toThrow(
      'Dompet sumber dan tujuan sama.'
    );
  });
});
