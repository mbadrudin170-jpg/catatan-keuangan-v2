
// context/KategoriContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const KUNCI_PENYIMPANAN_KATEGORI = 'kategori_storage';
const KUNCI_PENYIMPANAN_SUB_KATEGORI = 'sub_kategori_storage';

// --- Definisi Tipe Data ---
interface Kategori {
  id: string;
  nama: string;
}

interface SubKategori {
  id: string;
  idKategori: string; // Untuk relasi
  nama: string;
}

interface TipeKonteksKategori {
  // State untuk Kategori
  daftarKategori: Kategori[];
  kategoriTerpilih: Kategori | null;
  pilihKategori: (idKategori: string) => void;
  tambahKategori: (nama: string) => void;
  perbaruiKategori: (id: string, namaBaru: string) => void;
  hapusKategori: (id: string) => void;

  // State untuk Sub-Kategori
  daftarSubKategori: SubKategori[];
  idSubKategoriEdit: string | null;
  namaSubKategoriEdit: string;
  setNamaSubKategoriEdit: (nama: string) => void;
  setIdSubKategoriEdit: (id: string | null) => void;
  tambahSubKategori: (nama: string) => void;
  perbaruiSubKategori: () => void;
  hapusSubKategori: (id: string) => void;
}

// --- Konteks ---
const KonteksKategori = createContext<TipeKonteksKategori | undefined>(undefined);

export function useKategori() {
  const konteks = useContext(KonteksKategori);
  if (!konteks) {
    throw new Error('useKategori harus digunakan di dalam sebuah KategoriProvider');
  }
  return konteks;
}

// --- Provider ---
export function KategoriProvider({ children }: { children: ReactNode }) {
  // --- STATE (Keadaan) ---
  const [daftarKategori, setDaftarKategori] = useState<Kategori[]>([]);
  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori | null>(null);

  const [daftarSubKategori, setDaftarSubKategori] = useState<SubKategori[]>([]);
  const [idSubKategoriEdit, setIdSubKategoriEdit] = useState<string | null>(null);
  const [namaSubKategoriEdit, setNamaSubKategoriEdit] = useState('');

  // --- EFEK (Memuat data dari Async Storage) ---
  useEffect(() => {
    const muatData = async () => {
      // Memuat Kategori
      const kategoriTersimpan = await AsyncStorage.getItem(KUNCI_PENYIMPANAN_KATEGORI);
      const daftarKategoriDimuat = kategoriTersimpan ? JSON.parse(kategoriTersimpan) : [
        { id: '1', nama: 'Gaji' },
        { id: '2', nama: 'Freelance' },
      ];
      setDaftarKategori(daftarKategoriDimuat);
      if (daftarKategoriDimuat.length > 0 && !kategoriTerpilih) {
        setKategoriTerpilih(daftarKategoriDimuat[0]);
      }

      // Memuat Sub-Kategori
      const subKategoriTersimpan = await AsyncStorage.getItem(KUNCI_PENYIMPANAN_SUB_KATEGORI);
      const daftarSubKategoriDimuat = subKategoriTersimpan ? JSON.parse(subKategoriTersimpan) : [];
      setDaftarSubKategori(daftarSubKategoriDimuat);
    };
    muatData();
  }, []);


  // --- FUNGSI UNTUK KATEGORI ---
  const simpanDaftarKategori = async (daftar: Kategori[]) => {
    await AsyncStorage.setItem(KUNCI_PENYIMPANAN_KATEGORI, JSON.stringify(daftar));
  };

  const tambahKategori = (nama: string) => {
    const kategoriBaru = { id: Date.now().toString(), nama };
    const daftarBaru = [...daftarKategori, kategoriBaru];
    setDaftarKategori(daftarBaru);
    simpanDaftarKategori(daftarBaru);
    setKategoriTerpilih(kategoriBaru); // Langsung pilih kategori yang baru dibuat
  };

  const perbaruiKategori = (id: string, namaBaru: string) => {
    const daftarBaru = daftarKategori.map(kat => kat.id === id ? { ...kat, nama: namaBaru } : kat);
    setDaftarKategori(daftarBaru);
    simpanDaftarKategori(daftarBaru);
    if (kategoriTerpilih?.id === id) {
      setKategoriTerpilih({ id, nama: namaBaru });
    }
  };

  const hapusKategori = (id: string) => {
    const daftarBaru = daftarKategori.filter(kat => kat.id !== id);
    setDaftarKategori(daftarBaru);
    simpanDaftarKategori(daftarBaru);
    
    // Hapus juga sub-kategori yang terkait
    const subKategoriBaru = daftarSubKategori.filter(sub => sub.idKategori !== id);
    setDaftarSubKategori(subKategoriBaru);
    simpanDaftarSubKategori(subKategoriBaru);

    if (kategoriTerpilih?.id === id) {
      setKategoriTerpilih(daftarBaru.length > 0 ? daftarBaru[0] : null);
    }
  };

  const pilihKategori = (idKategori: string) => {
    const kategori = daftarKategori.find(kat => kat.id === idKategori);
    if (kategori) {
      setKategoriTerpilih(kategori);
    }
  };

  // --- FUNGSI UNTUK SUB-KATEGORI ---
   const simpanDaftarSubKategori = async (daftar: SubKategori[]) => {
    await AsyncStorage.setItem(KUNCI_PENYIMPANAN_SUB_KATEGORI, JSON.stringify(daftar));
  };

  const tambahSubKategori = (nama: string) => {
    if (!kategoriTerpilih) return;
    const subBaru = { id: Date.now().toString(), nama, idKategori: kategoriTerpilih.id };
    const daftarBaru = [...daftarSubKategori, subBaru];
    setDaftarSubKategori(daftarBaru);
    simpanDaftarSubKategori(daftarBaru);
  };

  const perbaruiSubKategori = () => {
    if (!idSubKategoriEdit) return;
    const daftarBaru = daftarSubKategori.map(sub =>
      sub.id === idSubKategoriEdit ? { ...sub, nama: namaSubKategoriEdit } : sub
    );
    setDaftarSubKategori(daftarBaru);
    simpanDaftarSubKategori(daftarBaru);
    setIdSubKategoriEdit(null);
    setNamaSubKategoriEdit('');
  };

  const hapusSubKategori = (id: string) => {
    const daftarBaru = daftarSubKategori.filter(sub => sub.id !== id);
    setDaftarSubKategori(daftarBaru);
    simpanDaftarSubKategori(daftarBaru);
  };


  // --- NILAI UNTUK PROVIDER ---
  const nilai: TipeKonteksKategori = {
    daftarKategori,
    kategoriTerpilih,
    pilihKategori,
    tambahKategori,
    perbaruiKategori,
    hapusKategori,
    
    daftarSubKategori,
    idSubKategoriEdit,
    namaSubKategoriEdit,
    setNamaSubKategoriEdit,
    setIdSubKategoriEdit,
    tambahSubKategori,
    perbaruiSubKategori,
    hapusSubKategori,
  };

  return (
    <KonteksKategori.Provider value={nilai}>
      {children}
    </KonteksKategori.Provider>
  );
}
