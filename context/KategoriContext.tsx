// context/KategoriContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const KUNCI_PENYIMPANAN_KATEGORI = 'kategori_storage_v2'; // Ganti nama key untuk migrasi data
const KUNCI_PENYIMPANAN_SUB_KATEGORI = 'sub_kategori_storage_v2';

// --- Definisi Tipe Data ---
type TipeTransaksi = 'Pemasukkan' | 'Pengeluaran';

interface Kategori {
  id: string;
  nama: string;
  tipe: TipeTransaksi;
}

interface SubKategori {
  id: string;
  idKategori: string;
  nama: string;
}

interface TipeKonteksKategori {
  // State Tipe
  tipeAktif: TipeTransaksi;
  setTipeAktif: (tipe: TipeTransaksi) => void;

  // State Kategori (sudah difilter)
  daftarKategori: Kategori[];
  kategoriTerpilih: Kategori | null;
  pilihKategori: (idKategori: string) => void;
  tambahKategori: (nama: string) => void;
  perbaruiKategori: (id: string, namaBaru: string) => void;
  hapusKategori: (id: string) => void;

  // State Sub-Kategori (sudah difilter)
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
const KonteksKategori = createContext<TipeKonteksKategori | undefined>(
  undefined
);

export function useKategori() {
  const konteks = useContext(KonteksKategori);
  if (!konteks) {
    throw new Error(
      'useKategori harus digunakan di dalam sebuah KategoriProvider'
    );
  }
  return konteks;
}

// --- Provider ---
export function KategoriProvider({ children }: { children: ReactNode }) {
  // --- STATE (Keadaan) ---
  const [tipeAktif, setTipeAktif] = useState<TipeTransaksi>('Pemasukkan');

  // State mentah yang menyimpan SEMUA data
  const [semuaKategori, setSemuaKategori] = useState<Kategori[]>([]);
  const [semuaSubKategori, setSemuaSubKategori] = useState<SubKategori[]>([]);

  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori | null>(
    null
  );
  const [idSubKategoriEdit, setIdSubKategoriEdit] = useState<string | null>(
    null
  );
  const [namaSubKategoriEdit, setNamaSubKategoriEdit] = useState('');

  // --- EFEK (Memuat data dari Async Storage) ---
  useEffect(() => {
    const muatData = async () => {
      const kategoriTersimpan = await AsyncStorage.getItem(
        KUNCI_PENYIMPANAN_KATEGORI
      );
      const daftarKategoriDimuat = kategoriTersimpan
        ? JSON.parse(kategoriTersimpan)
        : [
            { id: '1', nama: 'Gaji', tipe: 'Pemasukkan' },
            { id: '2', nama: 'Freelance', tipe: 'Pemasukkan' },
            { id: '3', nama: 'Makanan', tipe: 'Pengeluaran' },
            { id: '4', nama: 'Transportasi', tipe: 'Pengeluaran' },
          ];
      setSemuaKategori(daftarKategoriDimuat);

      const subKategoriTersimpan = await AsyncStorage.getItem(
        KUNCI_PENYIMPANAN_SUB_KATEGORI
      );
      const daftarSubKategoriDimuat = subKategoriTersimpan
        ? JSON.parse(subKategoriTersimpan)
        : [];
      setSemuaSubKategori(daftarSubKategoriDimuat);
    };
    muatData();
  }, []);

  // --- DATA YANG SUDAH DIFILTER (Memoized) ---
  const daftarKategori = useMemo(() => {
    return semuaKategori.filter((k) => k.tipe === tipeAktif);
  }, [semuaKategori, tipeAktif]);

  const daftarSubKategori = useMemo(() => {
    if (!kategoriTerpilih) return [];
    return semuaSubKategori.filter(
      (sub) => sub.idKategori === kategoriTerpilih.id
    );
  }, [semuaSubKategori, kategoriTerpilih]);

  // Efek untuk mereset pilihan saat tab diganti
  useEffect(() => {
    const kategoriPertamaDiTipe = daftarKategori[0] || null;
    setKategoriTerpilih(kategoriPertamaDiTipe);
  }, [tipeAktif, daftarKategori]);

  // --- FUNGSI PENYIMPANAN ---
  const simpanDaftarKategori = async (daftar: Kategori[]) => {
    await AsyncStorage.setItem(
      KUNCI_PENYIMPANAN_KATEGORI,
      JSON.stringify(daftar)
    );
  };

  const simpanDaftarSubKategori = async (daftar: SubKategori[]) => {
    await AsyncStorage.setItem(
      KUNCI_PENYIMPANAN_SUB_KATEGORI,
      JSON.stringify(daftar)
    );
  };

  // --- FUNGSI AKSI ---
  const tambahKategori = (nama: string) => {
    const kategoriBaru = { id: Date.now().toString(), nama, tipe: tipeAktif }; // <-- Tipe ditambahkan
    const daftarBaru = [...semuaKategori, kategoriBaru];
    setSemuaKategori(daftarBaru);
    simpanDaftarKategori(daftarBaru);
    setKategoriTerpilih(kategoriBaru);
  };

  const perbaruiKategori = (id: string, namaBaru: string) => {
    const daftarBaru = semuaKategori.map((kat) =>
      kat.id === id ? { ...kat, nama: namaBaru } : kat
    );
    setSemuaKategori(daftarBaru);
    simpanDaftarKategori(daftarBaru);
    if (kategoriTerpilih?.id === id) {
      setKategoriTerpilih((prev) =>
        prev ? { ...prev, nama: namaBaru } : null
      );
    }
  };

  const hapusKategori = (id: string) => {
    const daftarBaru = semuaKategori.filter((kat) => kat.id !== id);
    setSemuaKategori(daftarBaru);
    simpanDaftarKategori(daftarBaru);

    const subKategoriBaru = semuaSubKategori.filter(
      (sub) => sub.idKategori !== id
    );
    setSemuaSubKategori(subKategoriBaru);
    simpanDaftarSubKategori(subKategoriBaru);

    if (kategoriTerpilih?.id === id) {
      setKategoriTerpilih(daftarKategori[0] || null); // Pilih item pertama dari yg tersisa
    }
  };

  const pilihKategori = (idKategori: string) => {
    const kategori = semuaKategori.find((kat) => kat.id === idKategori);
    if (kategori) {
      setKategoriTerpilih(kategori);
    }
  };

  const tambahSubKategori = (nama: string) => {
    if (!kategoriTerpilih) return;
    const subBaru = {
      id: Date.now().toString(),
      nama,
      idKategori: kategoriTerpilih.id,
    };
    const daftarBaru = [...semuaSubKategori, subBaru];
    setSemuaSubKategori(daftarBaru);
    simpanDaftarSubKategori(daftarBaru);
  };

  const perbaruiSubKategori = () => {
    if (!idSubKategoriEdit) return;
    const daftarBaru = semuaSubKategori.map((sub) =>
      sub.id === idSubKategoriEdit ? { ...sub, nama: namaSubKategoriEdit } : sub
    );
    setSemuaSubKategori(daftarBaru);
    simpanDaftarSubKategori(daftarBaru);
    setIdSubKategoriEdit(null);
    setNamaSubKategoriEdit('');
  };

  const hapusSubKategori = (id: string) => {
    const daftarBaru = semuaSubKategori.filter((sub) => sub.id !== id);
    setSemuaSubKategori(daftarBaru);
    simpanDaftarSubKategori(daftarBaru);
  };

  // --- NILAI UNTUK PROVIDER ---
  const nilai: TipeKonteksKategori = {
    tipeAktif,
    setTipeAktif,
    daftarKategori, // Ini sudah difilter
    kategoriTerpilih,
    pilihKategori,
    tambahKategori,
    perbaruiKategori,
    hapusKategori,
    daftarSubKategori, // Ini sudah difilter
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
