// screens/detail-dompet/HeaderDetailDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { type JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useDetailDompetContext } from './logikaDetailDompet';

export default function HeaderDetailDompet(): JSX.Element | null {
  const { dompet } = useDetailDompetContext();

  // Jika dompet belum ada (misal masih loading), jangan tampilkan apapun untuk mencegah error
  if (!dompet) {
    return null;
  }

  return (
    <View style={gaya.header}>
      <Pressable onPress={() => router.back()} style={gaya.tombolHeader}>
        <Ionicons name="arrow-back" size={24} color={warna.teksUtama} />
      </Pressable>
      <Text style={gaya.judulHeader}>Detail Dompet</Text>
      <Pressable
        onPress={() => router.push({ pathname: '/(form)/form-dompet', params: { id: dompet.id } })}
        style={gaya.tombolHeader}
      >
        <Ionicons name="pencil" size={22} color={warna.primer} />
      </Pressable>
    </View>
  );
}

const warna = {
  primer: '#3b82f6',
  putih: '#ffffff',
  border: '#e5e7eb',
  teksUtama: '#1f2937',
};

const gaya = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
  },
  judulHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: warna.teksUtama,
  },
  tombolHeader: {
    padding: 8,
  },
});
