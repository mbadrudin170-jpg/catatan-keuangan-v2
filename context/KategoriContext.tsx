// context/KategoriContext.tsx
import type { JSX, ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Impor tipe terpusat
import type { Kategori, TipeTransaksi } from '@/database/tipe';
// Impor operasi database
import {
  ambilSemuaKategori,
  hapusKategori as dbHapusKategori,
  hapusSubkategori as dbHapusSubkategori,
  perbaruiKategori as dbPerbaruiKategori,
  perbaruiSubkategori as dbPerbaruiSubkategori,
  tambahKategori as dbTambahKategori,
  tambahSubkategori as dbTambahSubkategori,
} from '@/database/operasi';

// --- Definisi Tipe Konteks ---
interface KategoriContextType {
  daftarKategori: Kategori[];
  tipeAktif: TipeTransaksi;
  setTipeAktif: (tipe: TipeTransaksi) => void;
  tambahKategori: (nama: string, ikon: string, tipe: 'pemasukan' | 'pengeluaran') => Promise<void>;
  hapusKategori: (idKategori: number) => Promise<void>;
  perbaruiKategori: (idKategori: number, namaBaru: string, ikonBaru: string) => Promise<void>;
  tambahSubkategori: (idKategori: number, namaSubkategori: string) => Promise<void>;
  // DIUBAH: Parameter `idKategori` diganti nama menjadi `_idKategori` karena tidak digunakan.
  hapusSubkategori: (_idKategori: number, idSubkategori: number) => Promise<void>;
  perbaruiSubkategori: (
    _idKategori: number, // DIUBAH: Parameter diganti nama karena tidak digunakan.
    idSubkategori: number,
    namaBaru: string
  ) => Promise<void>;
  muatKategori: () => Promise<void>;
}

// --- Konteks ---
const KategoriContext = createContext<KategoriContextType | undefined>(undefined);

export const useKategori = (): KategoriContextType => {
  const context = useContext(KategoriContext);
  if (!context) {
    throw new Error('useKategori harus digunakan di dalam KategoriProvider');
  }
  return context;
};

// --- Provider ---
export function KategoriProvider({ children }: { children: ReactNode }): JSX.Element {
  const [semuaKategori, setSemuaKategori] = useState<Kategori[]>([]);
  const [tipeAktif, setTipeAktif] = useState<TipeTransaksi>('pengeluaran');

  const muatKategori = async (): Promise<void> => {
    try {
      const data = await ambilSemuaKategori();
      setSemuaKategori(data);
    } catch (e) {
      console.error('Gagal memuat kategori dari database:', e);
    }
  };

  useEffect(() => {
    void muatKategori();
  }, []);

  const tambahKategori = async (
    nama: string,
    ikon: string,
    tipe: 'pemasukan' | 'pengeluaran'
  ): Promise<void> => {
    try {
      await dbTambahKategori(nama, ikon, tipe);
      await muatKategori();
    } catch (error) {
      console.error('Gagal menambah kategori:', error);
      throw error;
    }
  };

  const hapusKategori = async (idKategori: number): Promise<void> => {
    try {
      await dbHapusKategori(idKategori);
      await muatKategori();
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
      await muatKategori();
    } catch (error) {
      console.error('Gagal memperbarui kategori:', error);
      throw error;
    }
  };

  const tambahSubkategori = async (idKategori: number, namaSubkategori: string): Promise<void> => {
    try {
      await dbTambahSubkategori(namaSubkategori, idKategori);
      await muatKategori();
    } catch (error) {
      console.error('Gagal menambah subkategori:', error);
      throw error;
    }
  };

  const hapusSubkategori = async (
    _idKategori: number, // DIUBAH: Parameter tidak digunakan, jadi diberi underscore.
    idSubkategori: number
  ): Promise<void> => {
    try {
      await dbHapusSubkategori(idSubkategori);
      await muatKategori();
    } catch (error) {
      console.error('Gagal menghapus subkategori:', error);
      throw error;
    }
  };

  const perbaruiSubkategori = async (
    _idKategori: number, // DIUBAH: Parameter tidak digunakan, jadi diberi underscore.
    idSubkategori: number,
    namaBaru: string
  ): Promise<void> => {
    try {
      await dbPerbaruiSubkategori(idSubkategori, namaBaru);
      await muatKategori();
    } catch (error) {
      console.error('Gagal memperbarui subkategori:', error);
      throw error;
    }
  };

  return (
    <KategoriContext.Provider
      value={{
        daftarKategori: semuaKategori,
        tipeAktif,
        setTipeAktif,
        tambahKategori,
        hapusKategori,
        perbaruiKategori,
        tambahSubkategori,
        hapusSubkategori,
        perbaruiSubkategori,
        muatKategori,
      }}
    >
      {children}
    </KategoriContext.Provider>
  );
}
