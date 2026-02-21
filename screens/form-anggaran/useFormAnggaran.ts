// ~/catatan-keuangan-v2/screens/form-anggaran/useFormAnggaran.ts
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import {
  ambilSatuAnggaranDenganRincian,
  perbaruiAnggaranDenganRincian,
  tambahAnggaranDenganRincian,
} from '@/database/operasi';
import type { TipeAnggaran, TipePeriode } from '@/database/tipe';
import type {
  AnggaranLokal,
  SubKategori,
  SubKategoriDetail,
} from '@/screens/anggaran/dataDummy';

export function useFormAnggaran(kategoriList: AnggaranLokal[]) {
  const params = useLocalSearchParams();
  const isEdit = !!params.id;
  const anggaranId = Number(params.id);

  const [tipeAnggaran, setTipeAnggaran] = useState<TipeAnggaran>('flat');
  const [kategori, setKategori] = useState<AnggaranLokal | null>(null);
  const [rincian, setRincian] = useState<SubKategoriDetail[]>([]);
  const [periode, setPeriode] = useState<TipePeriode>('bulanan');
  const [modalKategoriTerbuka, setModalKategoriTerbuka] = useState(false);
  const [totalAnggaranPersentase, setTotalAnggaranPersentase] = useState(0);

  useEffect(() => {
    const muatDataEdit = async () => {
      if (isEdit && kategoriList.length > 0) {
        const dataEdit = await ambilSatuAnggaranDenganRincian(anggaranId);
        if (dataEdit) {
          const kategoriCocok = kategoriList.find(k => k.id === dataEdit.kategori_id);
          if (!kategoriCocok) {
            console.error('Kategori untuk anggaran yang diedit tidak ditemukan');
            return;
          }
          setTipeAnggaran(dataEdit.tipe);
          setPeriode(dataEdit.periode);
          setKategori(kategoriCocok);
          if (dataEdit.tipe === 'persentase') {
            setTotalAnggaranPersentase(dataEdit.total_anggaran);
          }
          const rincianEdit = dataEdit.rincian || []; // Fallback ke array kosong
          const rincianDiformat = kategoriCocok.subKategori.map(sub => {
            const rincianCocok = rincianEdit.find(r => r.subkategori_id === sub.id);
            return {
              subkategori_id: sub.id,
              nama: sub.nama,
              jumlah: rincianCocok?.jumlah || 0,
              terpakai: 0,
              sisa: 0,
            };
          });
          setRincian(rincianDiformat);
        }
      }
    };
    muatDataEdit();
  }, [isEdit, anggaranId, kategoriList]);

  const totalAnggaran = useMemo(() => {
    if (tipeAnggaran === 'persentase') {
      return totalAnggaranPersentase;
    }
    return rincian.reduce((total, item) => total + item.jumlah, 0);
  }, [tipeAnggaran, rincian, totalAnggaranPersentase]);

  const handlePilihKategori = (kategoriTerpilih: AnggaranLokal) => {
    if (isEdit) {
      alert('Tidak dapat mengubah kategori saat mengedit anggaran.');
      setModalKategoriTerbuka(false);
      return;
    }
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
    if (totalAnggaran <= 0) {
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

    const rincianData = rincian.map(({ subkategori_id, jumlah }) => ({
      subkategori_id,
      jumlah,
    }));

    try {
      if (isEdit) {
        await perbaruiAnggaranDenganRincian(anggaranId, anggaranData, rincianData);
      } else {
        await tambahAnggaranDenganRincian(anggaranData, rincianData);
      }
      router.replace('/(tabs)/anggaran');
    } catch (error) {
      console.error('Gagal menyimpan anggaran:', error);
      alert('Terjadi kesalahan saat menyimpan anggaran.');
    }
  };

  return {
    isEdit,
    tipeAnggaran,
    kategori,
    rincian,
    periode,
    totalAnggaran,
    modalKategoriTerbuka,
    setTipeAnggaran,
    setPeriode,
    setRincian,
    setTotalAnggaranPersentase,
    handleSimpan,
    bukaModalKategori: () => setModalKategoriTerbuka(true),
    tutupModalKategori: () => setModalKategoriTerbuka(false),
    handlePilihKategori,
  };
}
