// screens/form-kategori/FormKategoriScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderFormKategori from './HeaderFormKategori';
import ListKategori from './ListKategori';
import ListSubKategori from './ListSubKategori';
import TombolSimpan from './TombolSimpan';
import TombolTipe from './TombolTipe';
import type { Kategori } from '../../database/tipe'; // Impor tipe Kategori

export default function FormKategoriScreen() {
  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori | null>(null);

  const handleSimpan = () => {
    Alert.alert('Simpan', 'Tombol Simpan Ditekan!');
  };

  return (
    <SafeAreaView style={gaya.container}>
      <HeaderFormKategori />
      <View style={gaya.kontenUtama}>
        <TombolTipe />
        {/* ListKategori sekarang menerima fungsi untuk mengangkat state ke atas */}
        <ListKategori 
          onKategoriSelect={setKategoriTerpilih} 
        />
        {/* ListSubKategori menerima kategori yang dipilih sebagai prop */}
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
