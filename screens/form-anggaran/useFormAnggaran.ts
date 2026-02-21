// ~/catatan-keuangan-v2/screens/form-anggaran/useFormAnggaran.ts
import { useMemo, useState } from 'react';

import { tambahAnggaranDenganRincian } from '@/database/operasi';
import type { TipePeriode } from '@/database/tipe';
import type { AnggaranLokal, SubKategori, SubKategoriDetail } from '@/screens/anggaran/dataDummy';
import { router } from 'expo-router';

export function useFormAnggaran() {
  const [tipeAnggaran, setTipeAnggaran] = useState<'flat' | 'persentase'>('flat');
  const [kategori, setKategori] = useState<AnggaranLokal | null>(null);
  const [rincian, setRincian] = useState<SubKategoriDetail[]>([]);
  const [periode, setPeriode] = useState<TipePeriode>('bulanan');
  const [modalKategoriTerbuka, setModalKategoriTerbuka] = useState(false);
  const [totalAnggaranPersentase, setTotalAnggaranPersentase] = useState(0);

  // Tentukan total anggaran berdasarkan tipe yang dipilih
  const totalAnggaran = useMemo(() => {
    if (tipeAnggaran === 'persentase') {
      return totalAnggaranPersentase;
    }
    // Untuk mode 'flat', total adalah jumlah dari semua rincian
    return rincian.reduce((total, item) => total + item.jumlah, 0);
  }, [tipeAnggaran, rincian, totalAnggaranPersentase]);

  const handlePilihKategori = (kategoriTerpilih: AnggaranLokal) => {
    setKategori(kategoriTerpilih);
    const rincianDiinisialisasi = kategoriTerpilih.subKategori.map((sub: SubKategori) => ({
      subkategori_id: sub.id,
      nama: sub.nama,
      jumlah: 0,
      terpakai: 0,
      sisa: 0,
    }));
    setRincian(rincianDiinisialisasi);
    setModalKategoriTerbuka(false);
  };

  const handleSimpan = async () => {
    if (!kategori) {
      alert('Silakan pilih kategori terlebih dahulu.');
      return;
    }
    if (tipeAnggaran === 'persentase' && totalAnggaran <= 0) {
      alert('Total anggaran harus lebih besar dari 0.');
      return;
    }

    const anggaranData = {
      total_anggaran: totalAnggaran,
      tipe: tipeAnggaran,
      periode: periode,
      tanggal_mulai: new Date().toISOString(),
      kategori_id: kategori.id,
    };

    // Hitung ulang jumlah rincian jika dalam mode persentase
    const rincianData = rincian.map(({ subkategori_id, jumlah }) => ({
      subkategori_id,
      jumlah: tipeAnggaran === 'persentase' ? (jumlah / 100) * totalAnggaran : jumlah,
    }));

    try {
      await tambahAnggaranDenganRincian(anggaranData, rincianData);
      router.back();
    } catch (error) {
      console.error('Gagal menyimpan anggaran:', error);
      alert('Terjadi kesalahan saat menyimpan anggaran.');
    }
  };

  return {
    tipeAnggaran,
    kategori,
    rincian,
    periode,
    totalAnggaran,
    modalKategoriTerbuka,
    setTipeAnggaran,
    setPeriode,
    setRincian,
    setTotalAnggaranPersentase, // Ekspor handler
    handleSimpan,
    bukaModalKategori: () => setModalKategoriTerbuka(true),
    tutupModalKategori: () => setModalKategoriTerbuka(false),
    handlePilihKategori,
  };
}
