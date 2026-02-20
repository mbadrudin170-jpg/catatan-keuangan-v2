// context/KategoriContext.tsx
import type { Kategori, Subkategori, TipeKategori } from '@/database/tipe';
import type { Dispatch, JSX, ReactNode, SetStateAction } from 'react';
import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';

import {
  ambilSemuaKategori,
  hapusKategori as dbHapusKategori,
  hapusSubkategori as dbHapusSubkategori,
  perbaruiKategori as dbPerbaruiKategori,
  perbaruiSubkategori as dbPerbaruiSubkategori,
  tambahKategori as dbTambahKategori,
  tambahSubkategori as dbTambahSubkategori,
} from '@/database/operasi';

export interface FormKategori {
  nama: string;
  ikon: string;
  tipe: TipeKategori | '';
}

export interface FormSubkategori {
  nama: string;
}

interface KategoriContextType {
  formKategori: FormKategori;
  setFormKategori: Dispatch<SetStateAction<FormKategori>>;
  formSubkategori: FormSubkategori;
  setFormSubkategori: Dispatch<SetStateAction<FormSubkategori>>;
  daftarKategori: Kategori[];
  memuat: boolean;
  muatUlangDaftarKategori: () => Promise<void>;
  tambahKategori: (nama: string, ikon: string, tipe: TipeKategori) => Promise<void>;
  perbaruiKategori: (id: number) => Promise<void>;
  hapusKategori: (id: number) => Promise<void>;
  muatKategoriUntukForm: (kategori: Kategori) => void;
  tambahSubkategori: (nama: string, idKategori: number) => Promise<void>;
  perbaruiSubkategori: (id: number, nama: string) => Promise<void>;
  hapusSubkategori: (id: number) => Promise<void>;
  muatSubkategoriUntukForm: (subkategori: Subkategori) => void;
  tipeAktif: TipeKategori;
  setTipeAktif: Dispatch<SetStateAction<TipeKategori>>;
}

const KategoriContext = createContext<KategoriContextType | undefined>(undefined);

interface KategoriProviderProps {
  children: ReactNode;
}

export function KategoriProvider({ children }: KategoriProviderProps): JSX.Element {
  const [formKategori, setFormKategori] = useState<FormKategori>({ nama: '', ikon: '', tipe: '' });
  const [formSubkategori, setFormSubkategori] = useState<FormSubkategori>({ nama: '' });
  const [daftarKategori, setDaftarKategori] = useState<Kategori[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [tipeAktif, setTipeAktif] = useState<TipeKategori>('pengeluaran');

  const muatUlangDaftarKategori = useCallback(async (): Promise<void> => {
    setMemuat(true);
    try {
      const semuaKategori = await ambilSemuaKategori();
      setDaftarKategori(semuaKategori);
    } catch (error) {
      console.error('Gagal memuat ulang daftar kategori:', error);
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    muatUlangDaftarKategori();
  }, []);

  const tambahKategori = useCallback(
    async (nama: string, ikon: string, tipe: TipeKategori): Promise<void> => {
      if (!nama) throw new Error('Nama kategori tidak boleh kosong.');
      if (!tipe) throw new Error('Tipe kategori harus dipilih.');
      try {
        await dbTambahKategori(nama, ikon, tipe);
        await muatUlangDaftarKategori();
      } catch (error) {
        console.error('Gagal menambah kategori:', error);
        throw error;
      }
    },
    [muatUlangDaftarKategori]
  );

  const perbaruiKategori = useCallback(
    async (id: number): Promise<void> => {
      if (!formKategori.nama) throw new Error('Nama kategori tidak boleh kosong.');
      try {
        await dbPerbaruiKategori(id, formKategori.nama, formKategori.ikon);
        await muatUlangDaftarKategori();
      } catch (error) {
        console.error('Gagal memperbarui kategori:', error);
        throw error;
      }
    },
    [formKategori, muatUlangDaftarKategori]
  );

  const hapusKategori = useCallback(
    async (id: number): Promise<void> => {
      try {
        await dbHapusKategori(id);
        await muatUlangDaftarKategori();
      } catch (error) {
        console.error('Gagal menghapus kategori:', error);
        throw error;
      }
    },
    [muatUlangDaftarKategori]
  );

  const muatKategoriUntukForm = (kategori: Kategori) => {
    setFormKategori({ nama: kategori.nama, ikon: kategori.ikon ?? '', tipe: kategori.tipe });
  };

  const tambahSubkategori = useCallback(
    async (nama: string, idKategori: number): Promise<void> => {
      if (!nama) throw new Error('Nama subkategori tidak boleh kosong.');
      try {
        await dbTambahSubkategori(nama, idKategori);
        await muatUlangDaftarKategori();
      } catch (error) {
        console.error('Gagal menambah subkategori:', error);
        throw error;
      }
    },
    [muatUlangDaftarKategori]
  );

  const perbaruiSubkategori = useCallback(
    async (id: number, nama: string): Promise<void> => {
      if (!nama) throw new Error('Nama subkategori tidak boleh kosong.');
      try {
        await dbPerbaruiSubkategori(id, nama);
        await muatUlangDaftarKategori();
      } catch (error) {
        console.error('Gagal memperbarui subkategori:', error);
        throw error;
      }
    },
    [muatUlangDaftarKategori]
  );

  const hapusSubkategori = useCallback(
    async (id: number): Promise<void> => {
      try {
        await dbHapusSubkategori(id);
        await muatUlangDaftarKategori();
      } catch (error) {
        console.error('Gagal menghapus subkategori:', error);
        throw error;
      }
    },
    [muatUlangDaftarKategori]
  );

  const muatSubkategoriUntukForm = (subkategori: Subkategori) => {
    setFormSubkategori({ nama: subkategori.nama });
  };

  return (
    <KategoriContext.Provider
      value={{
        formKategori,
        setFormKategori,
        formSubkategori,
        setFormSubkategori,
        daftarKategori,
        memuat,
        muatUlangDaftarKategori,
        tambahKategori,
        perbaruiKategori,
        hapusKategori,
        muatKategoriUntukForm,
        tambahSubkategori,
        perbaruiSubkategori,
        hapusSubkategori,
        muatSubkategoriUntukForm,
        tipeAktif,
        setTipeAktif,
      }}
    >
      {children}
    </KategoriContext.Provider>
  );
}

export const useKategori = (): KategoriContextType => {
  const context = useContext(KategoriContext);
  if (context === undefined) {
    throw new Error('useKategori harus digunakan di dalam KategoriProvider');
  }
  return context;
};
