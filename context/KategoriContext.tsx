// context/KategoriContext.tsx
import type { JSX, ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Impor tipe terpusat
import type { Kategori, Subkategori, TipeTransaksi } from '@/database/tipe';
// Impor operasi database
import {
  tambahKategori as dbTambahKategori,
  dapatkanSemuaKategori,
  hapusKategori as dbHapusKategori,
  perbaruiKategori as dbPerbaruiKategori,
  tambahSubkategori as dbTambahSubkategori,
  hapusSubkategori as dbHapusSubkategori,
  perbaruiSubkategori as dbPerbaruiSubkategori,
} from '@/database/operasi';

// --- Definisi Tipe Konteks ---
interface KategoriContextType {
  daftarKategori: Kategori[];
  tipeAktif: TipeTransaksi;
  setTipeAktif: (tipe: TipeTransaksi) => void;
  tambahKategori: (nama: string, ikon: string) => Promise<void>;
  hapusKategori: (idKategori: number) => Promise<void>;
  perbaruiKategori: (idKategori: number, namaBaru: string, ikonBaru: string) => Promise<void>;
  tambahSubkategori: (idKategori: number, namaSubkategori: string) => Promise<void>;
  hapusSubkategori: (idKategori: number, idSubkategori: number) => Promise<void>;
  perbaruiSubkategori: (idKategori: number, idSubkategori: number, namaBaru: string) => Promise<void>;
  muatKategori: () => Promise<void>;
}

// --- Konteks ---
const KategoriContext = createContext<KategoriContextType | undefined>(
  undefined
);

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
      const data = await dapatkanSemuaKategori();
      setSemuaKategori(data);
    } catch (e) {
      console.error('Gagal memuat kategori dari database:', e);
    }
  };

  useEffect(() => {
    void muatKategori();
  }, []);

  const tambahKategori = async (nama: string, ikon: string): Promise<void> => {
    try {
      await dbTambahKategori(nama, ikon, tipeAktif);
      await muatKategori(); // Muat ulang data setelah menambah
    } catch (error) {
      console.error('Gagal menambah kategori:', error);
    }
  };

  const hapusKategori = async (idKategori: number): Promise<void> => {
    try {
      await dbHapusKategori(idKategori);
      await muatKategori(); // Muat ulang data setelah menghapus
    } catch (error) {
      console.error('Gagal menghapus kategori:', error);
    }
  };

  const perbaruiKategori = async (idKategori: number, namaBaru: string, ikonBaru: string): Promise<void> => {
    try {
      await dbPerbaruiKategori(idKategori, namaBaru, ikonBaru);
      await muatKategori(); // Muat ulang data setelah memperbarui
    } catch (error) {
      console.error('Gagal memperbarui kategori:', error);
    }
  };

  const tambahSubkategori = async (idKategori: number, namaSubkategori: string): Promise<void> => {
    try {
      await dbTambahSubkategori(idKategori, namaSubkategori);
      await muatKategori(); // Muat ulang data
    } catch (error) {
      console.error('Gagal menambah subkategori:', error);
    }
  };

  const hapusSubkategori = async (idKategori: number, idSubkategori: number): Promise<void> => {
    try {
      await dbHapusSubkategori(idSubkategori);
      await muatKategori(); // Muat ulang data
    } catch (error) {
      console.error('Gagal menghapus subkategori:', error);
    }
  };

  const perbaruiSubkategori = async (
    idKategori: number,
    idSubkategori: number,
    namaBaru: string
  ): Promise<void> => {
    try {
      await dbPerbaruiSubkategori(idSubkategori, namaBaru);
      await muatKategori(); // Muat ulang data
    } catch (error) {
      console.error('Gagal memperbarui subkategori:', error);
    }
  };

  const daftarKategoriYangDifilter = semuaKategori.filter(
    (k) => k.tipe === tipeAktif
  );

  return (
    <KategoriContext.Provider
      value={{
        daftarKategori: daftarKategoriYangDifilter,
        tipeAktif,
        setTipeAktif,
        tambahKategori,
        hapusKategori,
        perbaruiKategori,
        tambahSubkategori,
        hapusSubkategori,
        perbaruiSubkategori,
        muatKategori,
      }}>
      {children}
    </KategoriContext.Provider>
  );
}
