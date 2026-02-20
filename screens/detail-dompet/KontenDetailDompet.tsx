// screens/detail-dompet/KontenDetailDompet.tsx
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import KartuTransaksi from '@/components/KartuTransaksi'; // Impor default
import type { Transaksi } from '@/database/tipe';
import { useDetailDompet } from './logikaDetailDompet';

export default function KontenDetailDompet() {
  const { transaksiDompet, memuat } = useDetailDompet();

  if (memuat) {
    return <Text style={gaya.memuat}>Memuat transaksi...</Text>;
  }

  const renderItem = ({ item }: ListRenderItemInfo<Transaksi>) => (
    // Tambahkan properti onPress yang diperlukan
    <KartuTransaksi transaksi={item} onPress={() => {}} />
  );

  return (
    <View style={gaya.penampung}>
      <FlashList
        data={transaksiDompet}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={gaya.kosong}>Belum ada transaksi</Text>}
      />
    </View>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
    paddingHorizontal: 16,
  },
  memuat: {
    textAlign: 'center',
    marginTop: 20,
  },
  kosong: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
