// screens/form-transaksi/FormTransaksiScreen.tsx
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransaksi } from '../../context/TransaksiContext'; // <-- BARU: Impor useTransaksi
import HeaderFormTransaksi from './HeaderFormTransaksi';
import InputFormTransaksi from './InputFormTransaksi';
import ModalPilihDompet from './modal/ModalPilihDompet';
import ModalPilihKategori from './modal/ModalPilihKategori';
import TombolsimpanFormTransaksi from './tombol/TombolSimpanFormTransaksi';
import TombolTipeFormTransaksi from './tombol/TombolTipeFormTransaksi';

// Kita definisikan tipe ini di sini juga agar bisa digunakan oleh state
type TipeTransaksi = 'Pemasukan' | 'Pengeluaran' | 'Transfer';

export default function FormTransaksiScreen() {
  // Mengabaikan variabel `tipeTransaksi` karena belum digunakan
  const [, aturTipeTransaksi] = useState<TipeTransaksi>('Pengeluaran');

  // --- BARU: Mengambil state dan fungsi modal dari konteks ---
  const {
    modalKategoriTerlihat,
    tutupModalKategori,
    modalDompetTerlihat,
    tutupModalDompet,
  } = useTransaksi();

  // Membuat fungsi yang akan menangani perubahan tipe dari komponen anak
  const handleTipeChange = (tipe: TipeTransaksi) => {
    aturTipeTransaksi(tipe);
    // Di sini kita bisa melihat perubahan di konsol untuk debugging
    console.log('Tipe transaksi di form utama sekarang:', tipe);
  };

  return (
    <SafeAreaView style={gaya.penampung}>
      <HeaderFormTransaksi />
      {/* Memberikan fungsi handleTipeChange ke prop onTipeChange */}
      <TombolTipeFormTransaksi onTipeChange={handleTipeChange} />

      {/* Area konten utama yang dibuat fleksibel dan bisa di-scroll */}
      <View style={gaya.areaKonten}>
        <ScrollView>
          {/* Nantinya kita bisa teruskan `tipeTransaksi` ini ke InputFormTransaksi jika diperlukan */}
          <InputFormTransaksi />
        </ScrollView>
      </View>
      <TombolsimpanFormTransaksi />

      {/* --- Render semua modal di sini dengan props yang benar --- */}
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
    flex: 1, // Memastikan area ini mengisi ruang yang tersisa di antara header dan tombol
  },
});
