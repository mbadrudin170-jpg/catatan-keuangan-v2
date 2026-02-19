// screens/form-transaksi/FormTransaksiScreen.tsx
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTransaksi } from '@/context/TransaksiContext';
import HeaderFormTransaksi from './HeaderFormTransaksi';
import InputFormTransaksi from './InputFormTransaksi';
import ModalPilihDompet from './modal/ModalPilihDompet';
import ModalPilihKategori from './modal/ModalPilihKategori';
import TombolsimpanFormTransaksi from './tombol/TombolSimpanFormTransaksi';
import TombolTipeFormTransaksi from './tombol/TombolTipeFormTransaksi';

export default function FormTransaksiScreen() {
  const {
    modalKategoriTerlihat,
    tutupModalKategori,
    modalDompetTerlihat,
    tutupModalDompet,
  } = useTransaksi();

  // DIHAPUS: Fungsi `handleTipeChange` sudah dipindahkan ke komponen tombol

  return (
    <SafeAreaView style={gaya.penampung}>
      <HeaderFormTransaksi />
      {/* DIUBAH: Prop onTipeChange dihapus karena tidak lagi diperlukan */}
      <TombolTipeFormTransaksi />

      <View style={gaya.areaKonten}>
        <ScrollView>
          <InputFormTransaksi />
        </ScrollView>
      </View>
      <TombolsimpanFormTransaksi />

      <ModalPilihKategori terlihat={modalKategoriTerlihat} saatTutup={tutupModalKategori} />
      <ModalPilihDompet terlihat={modalDompetTerlihat} saatTutup={tutupModalDompet} />
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
