// screens/form-dompet/ScreenFormDompet.tsx
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDompet } from '@/context/DompetContext';
import type { Dompet } from '@/database/tipe';
import HeaderFormDompet from './HeaderFormDompet';
import InputFormDompet from './InputFormDompet';
import TombolSimpan from './TombolSimpan';

export default function HalamanFormDompet() {
  const { id: idString } = useLocalSearchParams<{ id?: string }>();
  const { muatDompetTunggal, setDataForm } = useDompet();
  const [dompetEdit, setDompetEdit] = useState<Dompet | null>(null);

  const idNumerik = idString ? parseInt(idString, 10) : undefined;

  // Efek untuk memuat data saat mode edit
  useEffect(() => {
    if (idNumerik) {
      const dataDompet = muatDompetTunggal(idNumerik);
      setDompetEdit(dataDompet);
    }
  }, [idNumerik, muatDompetTunggal]);

  // Efek untuk membersihkan form saat komponen dilepas (unmount)
  useEffect(() => {
    return () => {
      setDataForm({
        namaDompet: '',
        saldoAwal: '',
        tipe: '',
        ikon: '',
      });
    };
  }, [setDataForm]);

  return (
    <SafeAreaView style={gaya.wadahAman}>
      <HeaderFormDompet />
      <ScrollView contentContainerStyle={gaya.kontenScroll}>
        {/* Teruskan data dompet yang akan diedit ke komponen input */}
        <InputFormDompet dompet={dompetEdit} />
        {/* Teruskan ID yang akan diedit ke tombol simpan */}
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
