// screens/detail-dompet/ScreenDetailDompet.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderDetailDompet from './HeaderDetailDompet';
import KontenDetailDompet from './KontenDetailDompet';
import { DetailDompetProvider } from './logikaDetailDompet';
import StatistikDompet from './StatistikDompet';

export default function ScreenDetailDompet() {
  return (
    <DetailDompetProvider>
      {/* Membungkus seluruh layar dengan SafeAreaView untuk menghindari notch */}
      <SafeAreaView style={gaya.areaAman}>
        <HeaderDetailDompet />
        <StatistikDompet />
        <KontenDetailDompet />
      </SafeAreaView>
    </DetailDompetProvider>
  );
}

const gaya = StyleSheet.create({
  // Gaya untuk SafeAreaView, memastikan ia mengisi seluruh area aman
  areaAman: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set warna latar belakang di sini
  },
  // Gaya untuk View yang menampung konten di dalamnya
  penampungKonten: {
    flex: 1,
  },
});
