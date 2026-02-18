// screens/kategori/KategoriScreen.tsx
import HeaderKategori from '@/screens/kategori/HeaderKategori';
import ListKategori from '@/screens/kategori/ListKategori';
import TombolTambahKategori from '@/screens/kategori/TombolTambahKategori';
import TombolTipe from '@/screens/kategori/TombolTipe';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KategoriScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderKategori />
      <TombolTipe />
      <ListKategori />
      <TombolTambahKategori />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
