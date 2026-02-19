// context/KategoriContext.tsx
import type { JSX, ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  ambilSemuaKategori,
  hapusKategori as dbHapusKategori,
  hapusSubkategori as dbHapusSubkategori,
  perbaruiKategori as dbPerbaruiKategori,
  perbaruiSubkategori as dbPerbaruiSubkategori,
  tambahKategori as dbTambahKategori,
  tambahSubkategori as dbTambahSubkategori,
} from '@/database/operasi';
import type { Kategori, TipeTransaksi } from '@/database/tipe';

interface KategoriContextType {
  daftarKategori: Kategori[];
  tipeAktif: TipeTransaksi;
  memuat: boolean;
  setTipeAktif: (tipe: TipeTransaksi) => void;
  tambahKategori: (nama: string, ikon: string, tipe: 'pemasukan' | 'pengeluaran') => Promise<void>;
  hapusKategori: (idKategori: number) => Promise<void>;
  perbaruiKategori: (idKategori: number, namaBaru: string, ikonBaru: string) => Promise<void>;
  tambahSubkategori: (idKategori: number, namaSubkategori: string) => Promise<void>;
  hapusSubkategori: (_idKategori: number, idSubkategori: number) => Promise<void>;
  perbaruiSubkategori: (
    _idKategori: number,
    idSubkategori: number,
    namaBaru: string
  ) => Promise<void>;
  muatUlangDaftarKategori: () => Promise<void>;
}

const KategoriContext = createContext<KategoriContextType | undefined>(undefined);

export const useKategori = (): KategoriContextType => {
  const context = useContext(KategoriContext);
  if (!context) {
    throw new Error('useKategori harus digunakan di dalam KategoriProvider');
  }
  return context;
};

interface KategoriProviderProps {
  children: ReactNode;
  initialDaftarKategori?: Kategori[];
}

export function KategoriProvider({ children, initialDaftarKategori }: KategoriProviderProps): JSX.Element {
  const [daftarKategori, setDaftarKategori] = useState<Kategori[]>(initialDaftarKategori || []);
  const [tipeAktif, setTipeAktif] = useState<TipeTransaksi>('pengeluaran');
  const [memuat, setMemuat] = useState(!initialDaftarKategori);

  const muatUlangDaftarKategori = useCallback(async (): Promise<void> => {
    setMemuat(true);
    try {
      const data = await ambilSemuaKategori();
      setDaftarKategori(data);
    } catch (e) {
      console.error('Gagal memuat kategori dari database:', e);
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    if (!initialDaftarKategori) {
      void muatUlangDaftarKategori();
    }
  }, [initialDaftarKategori, muatUlangDaftarKategori]);

  const tambahKategori = async (
    nama: string,
    ikon: string,
    tipe: 'pemasukan' | 'pengeluaran'
  ): Promise<void> => {
    try {
      await dbTambahKategori(nama, ikon, tipe);
      await muatUlangDaftarKategori();
    } catch (error) {
      console.error('Gagal menambah kategori:', error);
      throw error;
    }
  };

  const hapusKategori = async (idKategori: number): Promise<void> => {
    try {
      await dbHapusKategori(idKategori);
      await muatUlangDaftarKategori();
    } catch (error) {
      console.error('Gagal menghapus kategori:', error);
      throw error;
    }
  };

  const perbaruiKategori = async (
    idKategori: number,
    namaBaru: string,
    ikonBaru: string
  ): Promise<void> => {
    try {
      await dbPerbaruiKategori(idKategori, namaBaru, ikonBaru);
      await muatUlangDaftarKategori();
    } catch (error) {
      console.error('Gagal memperbarui kategori:', error);
      throw error;
    }
  };

  const tambahSubkategori = async (idKategori: number, namaSubkategori: string): Promise<void> => {
    try {
      await dbTambahSubkategori(namaSubkategori, idKategori);
      await muatUlangDaftarKategori();
    } catch (error) {
      console.error('Gagal menambah subkategori:', error);
      throw error;
    }
  };

  const hapusSubkategori = async (_idKategori: number, idSubkategori: number): Promise<void> => {
    try {
      await dbHapusSubkategori(idSubkategori);
      await muatUlangDaftarKategori();
    } catch (error) {
      console.error('Gagal menghapus subkategori:', error);
      throw error;
    }
  };

  const perbaruiSubkategori = async (
    _idKategori: number,
    idSubkategori: number,
    namaBaru: string
  ): Promise<void> => {
    try {
      await dbPerbaruiSubkategori(idSubkategori, namaBaru);
      await muatUlangDaftarKategori();
    } catch (error) {
      console.error('Gagal memperbarui subkategori:', error);
      throw error;
    }
  };

  return (
    <KategoriContext.Provider
      value={{
        daftarKategori,
        tipeAktif,
        memuat,
        setTipeAktif,
        tambahKategori,
        hapusKategori,
        perbaruiKategori,
        tambahSubkategori,
        hapusSubkategori,
        perbaruiSubkategori,
        muatUlangDaftarKategori,
      }}
    >
      {children}
    </KategoriContext.Provider>
  );
}
