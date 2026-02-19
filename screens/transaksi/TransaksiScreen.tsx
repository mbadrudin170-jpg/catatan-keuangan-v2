// screens/transaksi/TransaksiScreen.tsx
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DaftarTransaksi from './DaftarTransaksi';
import HeaderTransaksi from './HeaderTransaksi';
import TombolTambahTransaksi from './TombolTambahTransaksi';

export default function TransaksiScreen() {
  return (
    <SafeAreaView style={gaya.penampung}>
      <HeaderTransaksi />
      <DaftarTransaksi />
      <TombolTambahTransaksi />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
