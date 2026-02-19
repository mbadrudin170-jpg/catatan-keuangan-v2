// screens/kategori/KategoriScreen.tsx
import HeaderKategori from '@/screens/kategori/HeaderKategori';
import ListKategori from '@/screens/kategori/ListKategori';
import TombolTambahKategori from '@/screens/kategori/TombolTambahKategori';
import TombolTipe from '@/screens/kategori/TombolTipe';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KategoriScreen() {
  return (
    <SafeAreaView style={gaya.wadah}>
      <HeaderKategori />
      <View style={gaya.kontenUtama}>
        <TombolTipe />
        <ListKategori />
      </View>
      <TombolTambahKategori />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Latar belakang yang lebih modern dan bersih
  },
  kontenUtama: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
