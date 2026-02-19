// context/TransaksiContext.test.tsx
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { TransaksiProvider, useTransaksi } from './TransaksiContext';
import { Alert } from 'react-native';

// Mock database functions - menggunakan virtual mock karena path alias
jest.mock('@/database/operasi', () => ({
  ambilSemuaTransaksi: jest.fn(),
  tambahSatuTransaksi: jest.fn(),
}));

// Mock DompetContext
jest.mock('./DompetContext', () => ({
  useDompet: jest.fn(),
}));

// Import setelah mock
import { ambilSemuaTransaksi, tambahSatuTransaksi } from '@/database/operasi';
import { useDompet } from './DompetContext';

describe('TransaksiContext', () => {
  const mockTransaksi = [
    {
      id: 1,
      jumlah: 50000,
      keterangan: 'Makan siang',
      tanggal: '2024-01-01T00:00:00.000Z',
      tipe: 'pengeluaran',
      kategori_id: 1,
      dompet_id: 1,
      dompet_tujuan_id: null,
      subkategori_id: null,
    },
  ];

  const mockDompetFunctions = {
    tambahPemasukan: jest.fn().mockResolvedValue(undefined),
    tambahPengeluaran: jest.fn().mockResolvedValue(undefined),
    tambahTransfer: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (ambilSemuaTransaksi as jest.Mock).mockResolvedValue(mockTransaksi);
    (tambahSatuTransaksi as jest.Mock).mockResolvedValue(undefined);
    (useDompet as jest.Mock).mockReturnValue(mockDompetFunctions);
  });

  it('should load transactions on mount', async () => {
    const { result } = renderHook(() => useTransaksi(), {
      wrapper: TransaksiProvider,
    });

    expect(result.current.memuat).toBe(true);

    await waitFor(() => {
      expect(result.current.memuat).toBe(false);
    });

    expect(result.current.daftarTransaksi).toEqual(mockTransaksi);
    expect(ambilSemuaTransaksi).toHaveBeenCalledTimes(1);
  });

  it('should add pemasukan transaction', async () => {
    const transaksiBaru = {
      id: 2,
      jumlah: 100000,
      keterangan: 'Gaji',
      tanggal: '2024-01-02T00:00:00.000Z',
      tipe: 'pemasukan' as const,
      kategori_id: 2,
      dompet_id: 1,
      dompet_tujuan_id: null,
      subkategori_id: null,
    };

    const { result } = renderHook(() => useTransaksi(), {
      wrapper: TransaksiProvider,
    });

    await waitFor(() => {
      expect(result.current.memuat).toBe(false);
    });

    await act(async () => {
      await result.current.tambahTransaksi(transaksiBaru);
    });

    expect(tambahSatuTransaksi).toHaveBeenCalledWith(transaksiBaru);
    expect(mockDompetFunctions.tambahPemasukan).toHaveBeenCalledWith(1, 100000);
    expect(ambilSemuaTransaksi).toHaveBeenCalledTimes(2);
  });

  it('should add pengeluaran transaction', async () => {
    const transaksiBaru = {
      id: 2,
      jumlah: 50000,
      keterangan: 'Belanja',
      tanggal: '2024-01-02T00:00:00.000Z',
      tipe: 'pengeluaran' as const,
      kategori_id: 1,
      dompet_id: 1,
      dompet_tujuan_id: null,
      subkategori_id: null,
    };

    const { result } = renderHook(() => useTransaksi(), {
      wrapper: TransaksiProvider,
    });

    await waitFor(() => {
      expect(result.current.memuat).toBe(false);
    });

    await act(async () => {
      await result.current.tambahTransaksi(transaksiBaru);
    });

    expect(tambahSatuTransaksi).toHaveBeenCalledWith(transaksiBaru);
    expect(mockDompetFunctions.tambahPengeluaran).toHaveBeenCalledWith(1, 50000);
    expect(ambilSemuaTransaksi).toHaveBeenCalledTimes(2);
  });

  it('should add transfer transaction', async () => {
    const transaksiBaru = {
      id: 2,
      jumlah: 25000,
      keterangan: 'Transfer',
      tanggal: '2024-01-02T00:00:00.000Z',
      tipe: 'transfer' as const,
      kategori_id: null,
      dompet_id: 1,
      dompet_tujuan_id: 2,
      subkategori_id: null,
    };

    const { result } = renderHook(() => useTransaksi(), {
      wrapper: TransaksiProvider,
    });

    await waitFor(() => {
      expect(result.current.memuat).toBe(false);
    });

    await act(async () => {
      await result.current.tambahTransaksi(transaksiBaru);
    });

    expect(tambahSatuTransaksi).toHaveBeenCalledWith(transaksiBaru);
    expect(mockDompetFunctions.tambahTransfer).toHaveBeenCalledWith(1, 2, 25000);
    expect(ambilSemuaTransaksi).toHaveBeenCalledTimes(2);
  });

  it('should validate jumlah > 0', async () => {
    const transaksiInvalid = {
      id: 2,
      jumlah: 0,
      keterangan: 'Invalid',
      tanggal: '2024-01-02T00:00:00.000Z',
      tipe: 'pengeluaran' as const,
      kategori_id: 1,
      dompet_id: 1,
      dompet_tujuan_id: null,
      subkategori_id: null,
    };

    const { result } = renderHook(() => useTransaksi(), {
      wrapper: TransaksiProvider,
    });

    await waitFor(() => {
      expect(result.current.memuat).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.tambahTransaksi(transaksiInvalid);
      } catch (error) {
        // Expected error
      }
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Input Tidak Valid',
      'Jumlah transaksi harus lebih dari nol.'
    );
    expect(tambahSatuTransaksi).not.toHaveBeenCalled();
  });

  it('should validate dompet_id is selected', async () => {
    const transaksiInvalid = {
      id: 2,
      jumlah: 50000,
      keterangan: 'Invalid',
      tanggal: '2024-01-02T00:00:00.000Z',
      tipe: 'pengeluaran' as const,
      kategori_id: 1,
      dompet_id: 0,
      dompet_tujuan_id: null,
      subkategori_id: null,
    };

    const { result } = renderHook(() => useTransaksi(), {
      wrapper: TransaksiProvider,
    });

    await waitFor(() => {
      expect(result.current.memuat).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.tambahTransaksi(transaksiInvalid);
      } catch (error) {
        // Expected error
      }
    });

    expect(Alert.alert).toHaveBeenCalledWith('Input Tidak Valid', 'Anda harus memilih dompet sumber.');
    expect(tambahSatuTransaksi).not.toHaveBeenCalled();
  });

  it('should handle error when adding transaction', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (tambahSatuTransaksi as jest.Mock).mockRejectedValue(new Error('Database error'));

    const transaksiBaru = {
      id: 2,
      jumlah: 50000,
      keterangan: 'Test',
      tanggal: '2024-01-02T00:00:00.000Z',
      tipe: 'pengeluaran' as const,
      kategori_id: 1,
      dompet_id: 1,
      dompet_tujuan_id: null,
      subkategori_id: null,
    };

    const { result } = renderHook(() => useTransaksi(), {
      wrapper: TransaksiProvider,
    });

    await waitFor(() => {
      expect(result.current.memuat).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.tambahTransaksi(transaksiBaru);
      } catch (error) {
        // Expected error
      }
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
