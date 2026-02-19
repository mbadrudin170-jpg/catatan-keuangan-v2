// screens/form-kategori/FormKategoriScreen.tsx
import { useKategori } from '@/context/KategoriContext'; // DIIMPOR
import type { Kategori } from '@/database/tipe';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderFormKategori from './HeaderFormKategori';
import ListKategori from './ListKategori';
import ListSubKategori from './ListSubKategori';
import TombolSimpan from './TombolSimpan';
import TombolTipe from './TombolTipe';

export default function FormKategoriScreen() {
  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori | null>(null);
  // DIUBAH: Dapatkan tipe aktif dari context untuk diberikan ke komponen anak
  const { tipeAktif } = useKategori();

  const handleSimpan = () => {
    Alert.alert('Simpan', 'Tombol Simpan Ditekan!');
  };

  return (
    <SafeAreaView style={gaya.container}>
      <HeaderFormKategori />
      <View style={gaya.kontenUtama}>
        {/* TombolTipe akan mengubah `tipeAktif` di dalam context */}
        <TombolTipe />

        {/*
          DIUBAH:
          - ListKategori sekarang hanya muncul jika tipenya bukan 'transfer'.
          - Prop `tipe` yang dibutuhkan oleh ListKategori sekarang dipenuhi.
        */}
        {tipeAktif !== 'transfer' && (
          <ListKategori onKategoriSelect={setKategoriTerpilih} tipe={tipeAktif} />
        )}

        <ListSubKategori kategoriTerpilih={kategoriTerpilih} />
        <TombolSimpan onPress={handleSimpan} />
      </View>
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  kontenUtama: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
