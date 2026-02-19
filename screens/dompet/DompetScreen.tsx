// screens/dompet/Dompetscreen.tsx
import HeaderDompet from '@/screens/dompet/HeaderDompet';
import ListDompet from '@/screens/dompet/ListDompet';
import TombolTambahDompet from '@/screens/dompet/tombol/TombolTambahDompet';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DompetScreen() {
  return (
    <SafeAreaView style={gaya.wadahUtama} testID="dompet-screen-container">
      <HeaderDompet />
      <ListDompet />
      <TombolTambahDompet />
    </SafeAreaView>
  );
}

// Palet warna untuk layar ini
const warna = {
  latar: '#ffffff', // Warna latar putih bersih
};

// Kumpulan gaya untuk layar ini
const gaya = StyleSheet.create({
  wadahUtama: {
    flex: 1, // Memastikan wadah mengisi seluruh layar
    backgroundColor: warna.latar,
  },
});
