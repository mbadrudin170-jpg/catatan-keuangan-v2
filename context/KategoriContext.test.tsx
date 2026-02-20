// context/KategoriContext.test.tsx
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import * as dbOperasi from '@/database/operasi';
import type { Kategori, Subkategori } from '@/database/tipe';
import { KategoriProvider, useKategori } from './KategoriContext';

// Mock database operations
jest.mock('@/database/operasi', () => ({
  ambilSemuaKategori: jest.fn(),
  tambahSatuKategori: jest.fn(),
  perbaruiSatuKategori: jest.fn(),
  hapusSatuKategori: jest.fn(),
  tambahSatuSubkategori: jest.fn(),
  perbaruiSatuSubkategori: jest.fn(),
  hapusSatuSubkategori: jest.fn(),
}));

const mockDaftarKategori: Kategori[] = [
  { id: 1, nama: 'Makanan', tipe: 'pengeluaran', ikon: 'food', subkategori: [] },
  { id: 2, nama: 'Gaji', tipe: 'pemasukan', ikon: 'cash', subkategori: [] },
];

describe('KategoriContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <KategoriProvider>{children}</KategoriProvider>
  );

  beforeEach(() => {
    // Reset mocks before each test
    (dbOperasi.ambilSemuaKategori as jest.Mock).mockClear();
    (dbOperasi.tambahSatuKategori as jest.Mock).mockClear();
    (dbOperasi.perbaruiSatuKategori as jest.Mock).mockClear();
    (dbOperasi.hapusSatuKategori as jest.Mock).mockClear();
    (dbOperasi.tambahSatuSubkategori as jest.Mock).mockClear();
  });

  it('seharusnya memuat daftar kategori saat fungsi dipanggil', async () => {
    (dbOperasi.ambilSemuaKategori as jest.Mock).mockResolvedValue(mockDaftarKategori);

    const { result } = renderHook(() => useKategori(), { wrapper });

    await result.current.muatUlangKategori('pengeluaran');

    await waitFor(() => expect(result.current.memuat).toBe(false));

    expect(dbOperasi.ambilSemuaKategori).toHaveBeenCalledWith('pengeluaran');
    expect(result.current.daftarKategori).toEqual(mockDaftarKategori);
  });

  it('seharusnya bisa menambah kategori baru', async () => {
    const kategoriBaru: Omit<Kategori, 'id' | 'subkategori'> = {
      nama: 'Transportasi',
      tipe: 'pengeluaran',
      ikon: 'bus',
    };
    const { result } = renderHook(() => useKategori(), { wrapper });

    await result.current.tambahKategori(kategoriBaru);

    expect(dbOperasi.tambahSatuKategori).toHaveBeenCalledWith(kategoriBaru);
    expect(dbOperasi.ambilSemuaKategori).toHaveBeenCalledWith('pengeluaran');
  });

  it('seharusnya bisa memperbarui kategori', async () => {
    const kategoriDiperbarui: Omit<Kategori, 'subkategori'> = {
      id: 1,
      nama: 'Makanan & Minuman',
      tipe: 'pengeluaran',
      ikon: 'food',
    };
    const { result } = renderHook(() => useKategori(), { wrapper });

    await result.current.perbaruiKategori(kategoriDiperbarui);

    expect(dbOperasi.perbaruiSatuKategori).toHaveBeenCalledWith(kategoriDiperbarui);
    expect(dbOperasi.ambilSemuaKategori).toHaveBeenCalledWith('pengeluaran');
  });

  it('seharusnya bisa menghapus kategori', async () => {
    const { result } = renderHook(() => useKategori(), { wrapper });

    await result.current.hapusKategori(1, 'pengeluaran');

    expect(dbOperasi.hapusSatuKategori).toHaveBeenCalledWith(1);
    expect(dbOperasi.ambilSemuaKategori).toHaveBeenCalledWith('pengeluaran');
  });

  it('seharusnya bisa menambah subkategori baru', async () => {
    const subkategoriBaru: Omit<Subkategori, 'id'> = { nama: 'Restoran', kategori_id: 1 };
    const { result } = renderHook(() => useKategori(), { wrapper });

    await result.current.tambahSubkategori(subkategoriBaru, 'pengeluaran');

    expect(dbOperasi.tambahSatuSubkategori).toHaveBeenCalledWith(subkategoriBaru);
    expect(dbOperasi.ambilSemuaKategori).toHaveBeenCalledWith('pengeluaran');
  });
});
