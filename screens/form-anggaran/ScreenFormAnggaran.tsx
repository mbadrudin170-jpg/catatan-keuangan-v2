// ~/catatan-keuangan-v2/screens/form-anggaran/ScreenFormAnggaran.tsx
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ambilSemuaKategori } from '@/database/operasi';
import type { Kategori } from '@/database/tipe';
import type { AnggaranLokal } from '@/screens/anggaran/dataDummy';
import HeaderFormAnggaran from './HeaderFormAnggaran';
import InputFormAnggaran from './InputFormAnggaran';
import TombolTipeAnggaran from './TombolTipeAnggaran';
import { useFormAnggaran } from './useFormAnggaran';

export default function ScreenFormAnggaran() {
  const [kategoriList, setKategoriList] = useState<AnggaranLokal[]>([]);

  useEffect(() => {
    const muatKategori = async () => {
      const kategoriPengeluaran = await ambilSemuaKategori('pengeluaran');
      const formattedList: AnggaranLokal[] = kategoriPengeluaran.map((kat: Kategori) => ({
        id: kat.id,
        nama_kategori: kat.nama,
        total_anggaran: 0,
        terpakai: 0,
        sisa: 0,
        periode: 'bulanan',
        subKategori: kat.subkategori
          ? kat.subkategori.map(sub => ({ id: sub.id, nama: sub.nama }))
          : [],
      }));
      setKategoriList(formattedList);
    };

    muatKategori();
  }, []);

  const {
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
    bukaModalKategori,
    tutupModalKategori,
    handlePilihKategori,
  } = useFormAnggaran(kategoriList);

  return (
    <SafeAreaView style={gaya.container}>
      <HeaderFormAnggaran isEdit={isEdit} />

      <TombolTipeAnggaran tipeAnggaran={tipeAnggaran} setTipeAnggaran={setTipeAnggaran} />

      <InputFormAnggaran
        tipeAnggaran={tipeAnggaran}
        kategori={kategori}
        rincian={rincian}
        periode={periode}
        totalAnggaran={totalAnggaran}
        modalKategoriTerbuka={modalKategoriTerbuka}
        kategoriList={kategoriList}
        onPilihPeriode={setPeriode}
        onUpdateRincian={setRincian}
        onSimpan={handleSimpan}
        onBukaModalKategori={bukaModalKategori}
        onTutupModalKategori={tutupModalKategori}
        onPilihKategori={handlePilihKategori}
        onUbahTotalAnggaran={setTotalAnggaranPersentase}
      />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
