// screens/form-kategori/useFormKategori.ts
import { useKategori } from '@/context/KategoriContext';
import type { Kategori } from '@/database/tipe';
import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export function useFormKategori() {
  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori | null>(null);
  const {
    tipeAktif,
    setTipeAktif,
    daftarKategori,
    tambahKategori,
    hapusKategori,
    tambahSubkategori,
    hapusSubkategori,
    perbaruiSubkategori,
  } = useKategori();

  // Me-reset pilihan kategori saat tipe diubah
  useEffect(() => {
    setKategoriTerpilih(null);
  }, [tipeAktif]);

  const handleSimpan = () => {
    Alert.alert('Simpan', 'Tombol Simpan Ditekan!');
  };

  const kategoriDisesuaikan = useMemo(
    () => daftarKategori.filter((k) => k.tipe === tipeAktif),
    [daftarKategori, tipeAktif]
  );

  const subkategoriTerpilih = kategoriTerpilih
    ? kategoriDisesuaikan.find((k) => k.id === kategoriTerpilih.id)?.subkategori || []
    : [];

  return {
    tipeAktif,
    setTipeAktif,
    kategoriTerpilih,
    setKategoriTerpilih,
    kategoriDisesuaikan,
    subkategoriTerpilih,
    tambahKategori,
    hapusKategori,
    tambahSubkategori,
    hapusSubkategori,
    perbaruiSubkategori,
    handleSimpan,
  };
}
