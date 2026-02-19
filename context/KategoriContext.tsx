// context/KategoriContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Impor tipe terpusat yang sudah diperbaiki
import { Kategori, Subkategori, TipeTransaksi } from '../database/tipe';

const KUNCI_PENYIMPANAN = 'kategori_dan_subkategori_storage_v4'; // Versi diubah untuk menghindari konflik data lama

// --- Definisi Tipe Konteks (diperbaiki) ---
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

export const useKategori = () => {
  const context = useContext(KategoriContext);
  if (!context) {
    throw new Error('useKategori harus digunakan di dalam KategoriProvider');
  }
  return context;
};

// --- Data Awal (diperbaiki) ---
const DATA_AWAL: Kategori[] = [
  {
    id: 1,
    nama: 'Gaji',
    tipe: 'pemasukan', // huruf kecil
    ikon: 'cash-outline', // ikon ditambahkan
    subkategori: [],
  },
  {
    id: 2,
    nama: 'Kebutuhan',
    tipe: 'pengeluaran', // huruf kecil
    ikon: 'basket-outline', // ikon ditambahkan
    subkategori: [
      { id: 101, nama: 'Makanan' },
      { id: 102, nama: 'Transportasi' },
    ],
  },
  {
    id: 3,
    nama: 'Hiburan',
    tipe: 'pengeluaran', // huruf kecil
    ikon: 'game-controller-outline', // ikon ditambahkan
    subkategori: [{ id: 103, nama: 'Film' }],
  },
];

// --- Provider (diperbaiki) ---
export function KategoriProvider({ children }: { children: ReactNode }) {
  const [semuaKategori, setSemuaKategori] = useState<Kategori[]>([]);
  const [tipeAktif, setTipeAktif] = useState<TipeTransaksi>('pengeluaran'); // huruf kecil

  const muatKategori = async () => {
    try {
      const dataTersimpan = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
      const data = dataTersimpan ? JSON.parse(dataTersimpan) : DATA_AWAL;
      setSemuaKategori(data);
    } catch (e) {
      console.error('Gagal memuat kategori:', e);
      setSemuaKategori(DATA_AWAL);
    }
  };

  const simpanKategori = async (data: Kategori[]) => {
    try {
      await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(data));
    } catch (e) {
      console.error('Gagal menyimpan kategori:', e);
    }
  };

  useEffect(() => {
    muatKategori();
  }, []);

  const tambahKategori = async (nama: string, ikon: string) => {
    const kategoriBaru: Kategori = {
      id: Date.now(), // number, bukan string
      nama,
      ikon,
      tipe: tipeAktif,
      subkategori: [],
    };
    const dataBaru = [...semuaKategori, kategoriBaru];
    setSemuaKategori(dataBaru);
    await simpanKategori(dataBaru);
  };

  const hapusKategori = async (idKategori: number) => {
    const dataBaru = semuaKategori.filter((k) => k.id !== idKategori);
    setSemuaKategori(dataBaru);
    await simpanKategori(dataBaru);
  };

  const perbaruiKategori = async (idKategori: number, namaBaru: string, ikonBaru: string) => {
    const dataBaru = semuaKategori.map((k) =>
      k.id === idKategori ? { ...k, nama: namaBaru, ikon: ikonBaru } : k
    );
    setSemuaKategori(dataBaru);
    await simpanKategori(dataBaru);
  };

  const tambahSubkategori = async (idKategori: number, namaSubkategori: string) => {
    const subkategoriBaru: Subkategori = {
      id: Date.now(), // number, bukan string
      nama: namaSubkategori,
    };
    const dataBaru = semuaKategori.map((k) =>
      k.id === idKategori
        ? { ...k, subkategori: [...(k.subkategori || []), subkategoriBaru] }
        : k
    );
    setSemuaKategori(dataBaru);
    await simpanKategori(dataBaru);
  };

  const hapusSubkategori = async (idKategori: number, idSubkategori: number) => {
    const dataBaru = semuaKategori.map((k) => {
      if (k.id === idKategori) {
        const subkategoriDiperbarui = (k.subkategori || []).filter(
          (sub: Subkategori) => sub.id !== idSubkategori // tipe eksplisit ditambahkan
        );
        return { ...k, subkategori: subkategoriDiperbarui };
      }
      return k;
    });
    setSemuaKategori(dataBaru);
    await simpanKategori(dataBaru);
  };

  const perbaruiSubkategori = async (
    idKategori: number,
    idSubkategori: number,
    namaBaru: string
  ) => {
    const dataBaru = semuaKategori.map((k) => {
      if (k.id === idKategori) {
        const subkategoriDiperbarui = (k.subkategori || []).map((sub: Subkategori) => // tipe eksplisit ditambahkan
          sub.id === idSubkategori ? { ...sub, nama: namaBaru } : sub
        );
        return { ...k, subkategori: subkategoriDiperbarui };
      }
      return k;
    });
    setSemuaKategori(dataBaru);
    await simpanKategori(dataBaru);
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
