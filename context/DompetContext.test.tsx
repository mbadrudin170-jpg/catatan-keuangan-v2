// context/DompetContext.test.tsx

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { DompetProvider, useDompet } from './DompetContext';
import * as dbOps from '@/database/operasi';
import { Alert } from 'react-native';

// Mocking operasi database
jest.mock('@/database/operasi', () => ({
  ambilSatuDompet: jest.fn(),
  ambilSemuaDompet: jest.fn(),
  tambahDompet: jest.fn(),
  perbaruiDompet: jest.fn(),
  hapusDompet: jest.fn(),
}));

// Mock Alert agar tidak muncul saat testing
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('DompetContext', () => {
  const dompetPalsu = {
    id: 1,
    nama: 'Kas Utama',
    saldo: 100000,
    tipe: 'Tunai',
    ikon: 'cash',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dbOps.ambilSemuaDompet as jest.Mock).mockResolvedValue([dompetPalsu]);
    (dbOps.ambilSatuDompet as jest.Mock).mockResolvedValue(dompetPalsu);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DompetProvider>{children}</DompetProvider>
  );

  it('harus memvalidasi bahwa nama dompet tidak boleh kosong saat simpan', async () => {
    const { result } = renderHook(() => useDompet(), { wrapper });

    // Set form dengan nama kosong
    act(() => {
      result.current.setFormDompet({ nama: '', saldo: '1000', tipe: '', ikon: '' });
    });

    await expect(act(() => result.current.simpanDompetBaru())).rejects.toThrow(
      'Nama dompet tidak boleh kosong.'
    );

    expect(Alert.alert).toHaveBeenCalledWith('Validasi Gagal', expect.any(String));
  });

  it('harus menambah saldo dengan benar saat ada pemasukan', async () => {
    const { result } = renderHook(() => useDompet(), { wrapper });

    await act(async () => {
      await result.current.tambahPemasukan(1, 50000);
    });

    // Saldo awal 100.000 + 50.000 = 150.000
    expect(dbOps.perbaruiDompet).toHaveBeenCalledWith(1, 'Kas Utama', 150000, 'Tunai', 'cash');
  });

  it('harus mengurangi saldo dengan benar saat ada pengeluaran', async () => {
    const { result } = renderHook(() => useDompet(), { wrapper });

    await act(async () => {
      await result.current.tambahPengeluaran(1, 30000);
    });

    // Saldo awal 100.000 - 30.000 = 70.000
    expect(dbOps.perbaruiDompet).toHaveBeenCalledWith(1, 'Kas Utama', 70000, 'Tunai', 'cash');
  });

  it('harus memproses transfer antar dompet (mengurangi asal, menambah tujuan)', async () => {
    const dompetTujuanPalsu = { id: 2, nama: 'Bank', saldo: 200000, tipe: 'Bank', ikon: 'card' };

    // Mock agar pengembalian dompet berbeda sesuai ID
    (dbOps.ambilSatuDompet as jest.Mock).mockImplementation((id) => {
      if (id === 1) return Promise.resolve(dompetPalsu);
      if (id === 2) return Promise.resolve(dompetTujuanPalsu);
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useDompet(), { wrapper });

    await act(async () => {
      await result.current.tambahTransfer(1, 2, 50000);
    });

    // Cek dompet asal dikurangi
    expect(dbOps.perbaruiDompet).toHaveBeenCalledWith(1, 'Kas Utama', 50000, 'Tunai', 'cash');
    // Cek dompet tujuan ditambah
    expect(dbOps.perbaruiDompet).toHaveBeenCalledWith(2, 'Bank', 250000, 'Bank', 'card');
  });
});
