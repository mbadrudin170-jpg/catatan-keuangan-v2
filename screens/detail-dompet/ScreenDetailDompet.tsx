// screens/detail-dompet/ScreenDetailDompet.tsx

import { useLocalSearchParams } from 'expo-router';
import React, { type JSX } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

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
    <DetailDompetProvider value={logika}> {/** ask:  bungkus dengan safe area context 
     baca dahulu file PEDOMAN_KOLABORASI.md
    ini file terbaru yang sudah saya modifikasi jadi kamu gunakan data ini jangan gunakan data yang tersimpan di memori kamu
     selalu tulis kan jalur path file di paling atas setiap file
     tolong untuk penamaan variabel dan kunci usahakan gunakan bahasa indonesia terkecuali bahasa inggris nya yang sudah umum baru gunakana bahasa inggris nya
     */}
      <View style={gaya.wadah}>
        <HeaderDetailDompet />
        <KontenDetailDompet />
        <RiwayatTransaksiPerDompet dompetId={Number(dompetId)} />
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
