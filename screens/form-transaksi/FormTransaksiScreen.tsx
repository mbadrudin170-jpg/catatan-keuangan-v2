// screens/form-transaksi/FormTransaksiScreen.tsx
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderFormTransaksi from './HeaderFormTransaksi';
import InputFormTransaksi from './InputFormTransaksi';
import ModalPilihDompet from './modal/ModalPilihDompet';
import ModalPilihKategori from './modal/ModalPilihKategori';
import TombolsimpanFormTransaksi from './tombol/TombolSimpanFormTransaksi';
import TombolTipeFormTransaksi from './tombol/TombolTipeFormTransaksi';

export default function FormTransaksiScreen() {
  return (
    <SafeAreaView style={gaya.penampung}>
      <HeaderFormTransaksi />
      <TombolTipeFormTransaksi />

      <View style={gaya.areaKonten}>
        <ScrollView>
          <InputFormTransaksi />
        </ScrollView>
      </View>
      <TombolsimpanFormTransaksi />

      {/*
        DIUBAH: Props `terlihat` dan `saatTutup` telah dihapus.
        Manajemen state modal sekarang sepenuhnya dikendalikan oleh context.
      */}
      <ModalPilihKategori />
      <ModalPilihDompet />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
    backgroundColor: '#fff',
  },
  areaKonten: {
    flex: 1,
  },
});
