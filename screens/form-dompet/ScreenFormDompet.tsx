// screens/form-dompet/ScreenFormDompet.tsx
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDompet } from '@/context/DompetContext';
import HeaderFormDompet from './HeaderFormDompet';
import InputFormDompet from './InputFormDompet';
import TombolSimpan from './TombolSimpan';

// Definisikan state awal form yang bersih
const formAwal = {
  nama: '',
  tipe: 'tunai',
  ikon: 'cash',
};

export default function HalamanFormDompet() {
  const { id: idString } = useLocalSearchParams<{ id?: string }>();
  const { muatDompetUntukForm, setFormDompet } = useDompet();

  const idNumerik = idString ? parseInt(idString, 10) : undefined;

  useEffect(() => {
    if (idNumerik) {
      // Mode Edit: Muat data dompet dari context
      void muatDompetUntukForm(idNumerik);
    } else {
      // Mode Tambah: Gunakan state form yang bersih
      setFormDompet(formAwal);
    }

    // Fungsi cleanup untuk mereset form saat meninggalkan layar
    return () => {
      setFormDompet(formAwal);
    };
  }, [idNumerik, muatDompetUntukForm, setFormDompet]);

  return (
    <SafeAreaView style={gaya.wadahAman}>
      <HeaderFormDompet />
      <ScrollView contentContainerStyle={gaya.kontenScroll}>
        <InputFormDompet />
        {/* TombolSimpan tidak lagi memerlukan prop idEdit */}
        <TombolSimpan />
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
