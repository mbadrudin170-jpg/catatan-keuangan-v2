import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderKategori from './HeaderKategori';
import ListKategori from './ListKategori';
import TombolTambahKategori from './TombolTambahKategori';
import TombolTipe from './TombolTipe';
export default function KategoriScreen() {
  return (
    <SafeAreaView>
      <HeaderKategori />
      <TombolTipe />
      <ListKategori />
      <TombolTambahKategori />
    </SafeAreaView>
  );
}
