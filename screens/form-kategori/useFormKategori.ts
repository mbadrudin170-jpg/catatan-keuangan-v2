// screens/form-kategori/useFormKategori.ts
import { useKategori } from '@/context/KategoriContext';
import type { Kategori } from '@/database/tipe';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export function useFormKategori() {
  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori | null>(null);
  const {
    tipeAktif,
    setTipeAktif,
    daftarKategori,
    tambahKategori: tambahKategoriDariKonteks,
    hapusKategori: hapusKategoriDariKonteks,
    tambahSubkategori: tambahSubkategoriDariKonteks,
    hapusSubkategori: hapusSubkategoriDariKonteks,
    perbaruiSubkategori: perbaruiSubkategoriDariKonteks,
  } = useKategori();

  // Me-reset pilihan kategori saat tipe diubah
  useEffect(() => {
    setKategoriTerpilih(null);
  }, [tipeAktif]);

  // --- Fungsi Adaptor ---
  const tambahKategori = useCallback(
    (nama: string, ikon: string) => {
      const kategoriBaru = { nama, ikon, tipe: tipeAktif };
      tambahKategoriDariKonteks(kategoriBaru);
    },
    [tipeAktif, tambahKategoriDariKonteks]
  );

  const hapusKategori = useCallback(
    (id: number) => {
      hapusKategoriDariKonteks(id, tipeAktif);
    },
    [tipeAktif, hapusKategoriDariKonteks]
  );

  const tambahSubkategori = useCallback(
    (nama: string, kategoriId: number) => {
      const subkategoriBaru = { nama, kategori_id: kategoriId };
      tambahSubkategoriDariKonteks(subkategoriBaru, tipeAktif);
    },
    [tipeAktif, tambahSubkategoriDariKonteks]
  );

  const hapusSubkategori = useCallback(
    (id: number) => {
      hapusSubkategoriDariKonteks(id, tipeAktif);
    },
    [tipeAktif, hapusSubkategoriDariKonteks]
  );

  const perbaruiSubkategori = useCallback(
    (id: number, nama: string) => {
      if (kategoriTerpilih) {
        const subkategoriDiperbarui = { id, nama, kategori_id: kategoriTerpilih.id };
        perbaruiSubkategoriDariKonteks(subkategoriDiperbarui, tipeAktif);
      }
    },
    [tipeAktif, perbaruiSubkategoriDariKonteks, kategoriTerpilih]
  );
  // --- Akhir Fungsi Adaptor ---

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
