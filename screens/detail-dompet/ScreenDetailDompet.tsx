// screens/detail-dompet/ScreenDetailDompet.tsx

import { useLocalSearchParams } from 'expo-router';
import React, { type JSX } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderDetailDompet from '@/screens/detail-dompet/HeaderDetailDompet';
import KontenDetailDompet from '@/screens/detail-dompet/KontenDetailDompet';
import { DetailDompetProvider, useDetailDompet } from './logikaDetailDompet';
import RiwayatTransaksiPerDompet from './RiwayatTransaksiPerDompet';
import TombolHapusDetailDompet from './TombolHapusDetailDompet';

function KontenHalaman(): JSX.Element {
  const logika = useDetailDompet();
  const { dompetId } = useLocalSearchParams<{ dompetId: string }>();

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
      <SafeAreaView style={gaya.wadah}>
        <HeaderDetailDompet />
        <KontenDetailDompet />
        <RiwayatTransaksiPerDompet dompetId={Number(dompetId)} />
        <TombolHapusDetailDompet />
      </SafeAreaView>
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
