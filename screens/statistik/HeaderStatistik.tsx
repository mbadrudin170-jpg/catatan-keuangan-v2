// screens/statistik/HeaderStatistik.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WARNA } from './konstanta';

export const HeaderStatistik = () => {
  return (
    <View style={styles.wadah}>
      <Text style={styles.judul}>Statistik</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wadah: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 16,
    backgroundColor: WARNA.bg,
  },
  judul: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WARNA.teksUtama,
  },
});
