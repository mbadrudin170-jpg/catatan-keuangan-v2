// screens/detail-transaksi/HeaderDetailTransaksi.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { type JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import TombolEditDetailTransaksi from './TombolEditDetailTransaksi';
import TombolHapusDetailTransaksi from './TombolHapusDetailTransaksi';

export default function HeaderDetailTransaksi(): JSX.Element {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.tombolIkon}>
        <Ionicons name="arrow-back" size={24} color="#333333" />
      </Pressable>
      <Text style={styles.judul}>Detail Transaksi</Text>

      {/* Grup untuk menampung tombol aksi di sebelah kanan */}
      <View style={styles.grupTombol}>
        <TombolEditDetailTransaksi />
        <TombolHapusDetailTransaksi />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  judul: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  tombolIkon: {
    padding: 8,
  },
  // Gaya untuk mengelompokkan tombol di kanan
  grupTombol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
