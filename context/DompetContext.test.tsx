// context/DompetContext.test.tsx
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import * as dbOperasi from '@/database/operasi';
import type { Dompet } from '@/database/tipe';
import { DompetProvider, useDompet } from './DompetContext';

// Mock database operations
jest.mock('@/database/operasi', () => ({
  ambilSemuaDompet: jest.fn(),
  tambahSatuDompet: jest.fn(),
  perbaruiSatuDompet: jest.fn(),
  hapusSatuDompet: jest.fn(),
  perbaruiSaldoDompet: jest.fn(),
}));

const mockDaftarDompet: Dompet[] = [
  { id: 1, nama: 'Dompet Utama', saldo: 1000, tipe: 'cash', ikon: 'wallet' },
  { id: 2, nama: 'Bank', saldo: 5000, tipe: 'bank', ikon: 'bank' },
];

describe('DompetContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DompetProvider>{children}</DompetProvider>
  );

  beforeEach(() => {
    // Reset mocks before each test
    (dbOperasi.ambilSemuaDompet as jest.Mock).mockClear();
    (dbOperasi.tambahSatuDompet as jest.Mock).mockClear();
    (dbOperasi.perbaruiSatuDompet as jest.Mock).mockClear();
    (dbOperasi.hapusSatuDompet as jest.Mock).mockClear();
    (dbOperasi.perbaruiSaldoDompet as jest.Mock).mockClear();
  });

  it('seharusnya memuat daftar dompet saat inisialisasi', async () => {
    (dbOperasi.ambilSemuaDompet as jest.Mock).mockResolvedValue(mockDaftarDompet);

    const { result } = renderHook(() => useDompet(), { wrapper });

    await waitFor(() => expect(result.current.memuat).toBe(false));

    expect(dbOperasi.ambilSemuaDompet).toHaveBeenCalledTimes(1);
    expect(result.current.daftarDompet).toEqual(mockDaftarDompet);
  });

  it('seharusnya bisa menambah dompet baru', async () => {
    const dompetBaru = { nama: 'Dompet Baru', tipe: 'ewallet', ikon: 'cellphone' };
    (dbOperasi.ambilSemuaDompet as jest.Mock).mockResolvedValue(mockDaftarDompet);

    const { result } = renderHook(() => useDompet(), { wrapper });

    await waitFor(() => expect(result.current.memuat).toBe(false));
    await result.current.tambahDompet(dompetBaru);

    expect(dbOperasi.tambahSatuDompet).toHaveBeenCalledWith(dompetBaru);
    expect(dbOperasi.ambilSemuaDompet).toHaveBeenCalledTimes(2); // Initial load + reload
  });

  it('seharusnya bisa memperbarui dompet', async () => {
    const dompetDiperbarui = { id: 1, nama: 'Dompet Saya', tipe: 'cash', ikon: 'wallet' };
    (dbOperasi.ambilSemuaDompet as jest.Mock).mockResolvedValue(mockDaftarDompet);

    const { result } = renderHook(() => useDompet(), { wrapper });

    await waitFor(() => expect(result.current.memuat).toBe(false));
    await result.current.perbaruiDompet(dompetDiperbarui);

    expect(dbOperasi.perbaruiSatuDompet).toHaveBeenCalledWith(dompetDiperbarui);
    expect(dbOperasi.ambilSemuaDompet).toHaveBeenCalledTimes(2);
  });

  it('seharusnya bisa menghapus dompet', async () => {
    (dbOperasi.ambilSemuaDompet as jest.Mock).mockResolvedValue(mockDaftarDompet);

    const { result } = renderHook(() => useDompet(), { wrapper });

    await waitFor(() => expect(result.current.memuat).toBe(false));
    await result.current.hapusDompet(1);

    expect(dbOperasi.hapusSatuDompet).toHaveBeenCalledWith(1);
    expect(dbOperasi.ambilSemuaDompet).toHaveBeenCalledTimes(2);
  });

  it('seharusnya bisa menambah pemasukan ke dompet', async () => {
    const { result } = renderHook(() => useDompet(), { wrapper });

    await result.current.tambahPemasukan(1, 100);

    expect(dbOperasi.perbaruiSaldoDompet).toHaveBeenCalledWith(1, 100);
  });

  it('seharusnya bisa menambah pengeluaran dari dompet', async () => {
    const { result } = renderHook(() => useDompet(), { wrapper });

    await result.current.tambahPengeluaran(1, 100);

    expect(dbOperasi.perbaruiSaldoDompet).toHaveBeenCalledWith(1, -100);
  });

  it('seharusnya bisa melakukan transfer antar dompet', async () => {
    const { result } = renderHook(() => useDompet(), { wrapper });

    await result.current.tambahTransfer(2, 1, 500);

    expect(dbOperasi.perbaruiSaldoDompet).toHaveBeenCalledWith(2, -500);
    expect(dbOperasi.perbaruiSaldoDompet).toHaveBeenCalledWith(1, 500);
  });

  it('seharusnya bisa mengambil dompet dengan id yang benar', async () => {
    (dbOperasi.ambilSemuaDompet as jest.Mock).mockResolvedValue(mockDaftarDompet);
    const { result } = renderHook(() => useDompet(), { wrapper });

    await waitFor(() => expect(result.current.memuat).toBe(false));

    const dompet = result.current.ambilDompetDenganId(1);
    expect(dompet).toEqual(mockDaftarDompet[0]);

    const tidakDitemukan = result.current.ambilDompetDenganId(99);
    expect(tidakDitemukan).toBeUndefined();
  });
});
