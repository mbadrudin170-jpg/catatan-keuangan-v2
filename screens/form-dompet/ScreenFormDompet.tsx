// screens/form-dompet/ScreenFormDompet.tsx
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDompet } from '@/context/DompetContext';
import HeaderFormDompet from './HeaderFormDompet';
import InputFormDompet from './InputFormDompet';
import TombolSimpan from './TombolSimpan';

export default function HalamanFormDompet() {
  const { id: idString } = useLocalSearchParams<{ id?: string }>();
  const { muatDompetUntukForm, setFormDompet } = useDompet();

  const idNumerik = idString ? parseInt(idString, 10) : undefined;

  // DIUBAH: Logika efek disederhanakan setelah perbaikan di context
  useEffect(() => {
    if (idNumerik) {
      // Mode Edit: Muat data dompet ke dalam form context
      void muatDompetUntukForm(idNumerik);
    } else {
      // Mode Tambah: Pastikan form bersih saat layar dibuka
      setFormDompet({
        nama: '',
        saldo: '',
        tipe: '',
        ikon: '',
      });
    }

    // Fungsi cleanup sekarang hanya reset form jika diperlukan
    return () => {
      setFormDompet({
        nama: '',
        saldo: '',
        tipe: '',
        ikon: '',
      });
    };
    // Dependensi: Cukup `idNumerik`. Fungsi context sekarang stabil.
  }, [idNumerik, muatDompetUntukForm, setFormDompet]); // DIUBAH: Dependensi diperbarui

  return (
    <SafeAreaView style={gaya.wadahAman}>
      <HeaderFormDompet />
      <ScrollView contentContainerStyle={gaya.kontenScroll}>
        <InputFormDompet />
        <TombolSimpan idEdit={idNumerik} />
      </ScrollView>
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  wadahAman: {
    flex: 1,
    backgroundColor: 'white',
  },
  kontenScroll: {
    padding: 16,
  },
});
