// screens/kategori/KategoriScreen.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderKategori from './HeaderKategori';
import { ListKategori } from './ListKategori'; // Menggunakan named import
import TombolTambahKategori from './TombolTambahKategori';
import TombolTipe from './TombolTipe';
import { useKategoriScreen } from './useKategoriScreen';

const KategoriScreen: React.FC = () => {
  const {
    tipeAktif,
    setTipeAktif,
    kategoriDisesuaikan,
    kategoriTerpilih,
    daftarSubKategori,
    handlePilihKategori,
  } = useKategoriScreen();

  return (
    <SafeAreaView style={gaya.penampung}>
      <HeaderKategori />
      <View style={gaya.kontenUtama}>
        <TombolTipe tipeAktif={tipeAktif} setTipeAktif={setTipeAktif} />
        <ListKategori
          daftarKategori={kategoriDisesuaikan}
          kategoriTerpilih={kategoriTerpilih}
          onKategoriSelect={handlePilihKategori}
          daftarSubKategori={daftarSubKategori}
        />
      </View>
      <TombolTambahKategori />
    </SafeAreaView>
  );
};

export default KategoriScreen;

const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  kontenUtama: {
    flex: 1,
  },
});
