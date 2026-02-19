// ~/catatan-keuangan-v2/screens/detail-dompet/ScreenDetailDompet.tsx

import React, { type JSX } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import HeaderDetailDompet from '@/screens/detail-dompet/HeaderDetailDompet';
import KontenDetailDompet from '@/screens/detail-dompet/KontenDetailDompet';
import TombolHapusDetailDompet from './TombolHapusDetailDompet';
import { DetailDompetProvider, useDetailDompet } from './logikaDetailDompet';

function KontenHalaman(): JSX.Element {
  const logika = useDetailDompet();

  if (logika.memuat) {
    return <ActivityIndicator size="large" color="#3b82f6" style={gaya.pusat} />;
  }

  if (!logika.dompet) {
    return (
      <View style={gaya.pusat}>
        <Text>Dompet tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <DetailDompetProvider value={logika}>
      <View style={gaya.wadah}>
        <HeaderDetailDompet />
        <KontenDetailDompet />
        <TombolHapusDetailDompet />
      </View>
    </DetailDompetProvider>
  );
}

export default function DetailDompetHalaman(): JSX.Element {
  return <KontenHalaman />;
}

const gaya = StyleSheet.create({
  wadah: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  pusat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
