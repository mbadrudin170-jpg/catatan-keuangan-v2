// screens/kategori/useKategoriScreen.ts
import { useKategori } from '@/context/KategoriContext';
import type { Kategori } from '@/database/tipe';
import { useEffect, useMemo, useState } from 'react';

export function useKategoriScreen() {
  const { tipeAktif, setTipeAktif, semuaKategori } = useKategori();
  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori | null>(null);

  const kategoriDisesuaikan = useMemo(
    () => semuaKategori.filter((k: Kategori) => k.tipe === tipeAktif),
    [semuaKategori, tipeAktif]
  );

  // Efek untuk me-reset pilihan kategori saat tipe berubah
  // atau saat daftar kategori yang relevan berubah
  useEffect(() => {
    if (kategoriDisesuaikan.length > 0) {
      // Jika kategori yang sedang dipilih tidak ada di daftar baru, reset
      const pilihanSaatIniMasihValid = kategoriDisesuaikan.some(
        (k: Kategori) => k.id === kategoriTerpilih?.id
      );
      if (!pilihanSaatIniMasihValid) {
        setKategoriTerpilih(kategoriDisesuaikan[0]);
      }
    } else {
      setKategoriTerpilih(null);
    }
  }, [kategoriDisesuaikan, kategoriTerpilih]);

  // Efek khusus untuk handle kasus di mana user berganti tipe,
  // kita ingin selalu mulai dari item pertama
  useEffect(() => {
    if (kategoriDisesuaikan.length > 0) {
      setKategoriTerpilih(kategoriDisesuaikan[0]);
    } else {
      setKategoriTerpilih(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipeAktif]);

  const daftarSubKategori = useMemo(() => {
    return kategoriTerpilih?.subkategori || [];
  }, [kategoriTerpilih]);

  const handlePilihKategori = (kategori: Kategori) => {
    setKategoriTerpilih(kategori);
  };

  return {
    tipeAktif,
    setTipeAktif,
    kategoriDisesuaikan,
    kategoriTerpilih,
    daftarSubKategori,
    handlePilihKategori,
  };
}
