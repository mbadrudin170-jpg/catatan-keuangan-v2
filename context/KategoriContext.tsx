// context/KategoriContext.tsx
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  ambilSemuaKategori as dbAmbilSemuaKategori,
  hapusSatuKategori,
  hapusSatuSubkategori,
  perbaruiSatuKategori,
  perbaruiSatuSubkategori,
  tambahSatuKategori,
  tambahSatuSubkategori,
} from '@/database/operasi';
import type { Kategori, Subkategori, TipeKategori } from '@/database/tipe';

interface KategoriContextType {
  semuaKategori: Kategori[];
  tambahKategori: (kategori: Omit<Kategori, 'id' | 'subkategori'>) => Promise<void>;
  perbaruiKategori: (kategori: Omit<Kategori, 'subkategori'>) => Promise<void>;
  hapusKategori: (id: number, tipe: TipeKategori) => Promise<void>;
  tambahSubkategori: (
    subkategori: Omit<Subkategori, 'id'>,
    tipe: TipeKategori
  ) => Promise<void>;
  perbaruiSubkategori: (subkategori: Subkategori, tipe: TipeKategori) => Promise<void>;
  hapusSubkategori: (id: number, tipe: TipeKategori) => Promise<void>;
  muatUlangKategori: () => Promise<void>;
  memuat: boolean;
  tipeAktif: TipeKategori;
  setTipeAktif: Dispatch<SetStateAction<TipeKategori>>;
}

const KategoriContext = createContext<KategoriContextType | undefined>(undefined);

export const KategoriProvider = ({ children }: { children: ReactNode }) => {
  const [semuaKategori, setSemuaKategori] = useState<Kategori[]>([]);
  const [memuat, setMemuat] = useState(false);
  const [tipeAktif, setTipeAktif] = useState<TipeKategori>('pengeluaran');

  const muatUlangKategori = useCallback(async () => {
    setMemuat(true);
    try {
      const kategoriPengeluaran = await dbAmbilSemuaKategori('pengeluaran');
      const kategoriPemasukan = await dbAmbilSemuaKategori('pemasukan');
      setSemuaKategori([...kategoriPengeluaran, ...kategoriPemasukan]);
    } catch (error) {
      console.error(`Gagal memuat semua kategori:`, error);
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    muatUlangKategori();
  }, [muatUlangKategori]);

  const tambahKategori = async (kategori: Omit<Kategori, 'id' | 'subkategori'>) => {
    await tambahSatuKategori(kategori);
    await muatUlangKategori();
  };

  const perbaruiKategori = async (kategori: Omit<Kategori, 'subkategori'>) => {
    await perbaruiSatuKategori(kategori);
    await muatUlangKategori();
  };

  const hapusKategori = async (id: number, tipe: TipeKategori) => {
    await hapusSatuKategori(id);
    await muatUlangKategori();
  };

  const tambahSubkategori = async (
    subkategori: Omit<Subkategori, 'id'>,
    tipe: TipeKategori
  ) => {
    await tambahSatuSubkategori(subkategori);
    await muatUlangKategori();
  };

  const perbaruiSubkategori = async (subkategori: Subkategori, tipe: TipeKategori) => {
    await perbaruiSatuSubkategori(subkategori);
    await muatUlangKategori();
  };

  const hapusSubkategori = async (id: number, tipe: TipeKategori) => {
    await hapusSatuSubkategori(id);
    await muatUlangKategori();
  };

  const nilai = {
    semuaKategori,
    tambahKategori,
    perbaruiKategori,
    hapusKategori,
    tambahSubkategori,
    perbaruiSubkategori,
    hapusSubkategori,
    muatUlangKategori,
    memuat,
    tipeAktif,
    setTipeAktif,
  };

  return <KategoriContext.Provider value={nilai}>{children}</KategoriContext.Provider>;
};

export const useKategori = () => {
  const context = useContext(KategoriContext);
  if (context === undefined) {
    throw new Error('useKategori harus digunakan di dalam KategoriProvider');
  }
  return context;
};
