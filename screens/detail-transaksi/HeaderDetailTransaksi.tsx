// screens/detail-transaksi/HeaderDetailTransaksi.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { type JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderDetailTransaksi(): JSX.Element {
  return (
    <View style={styles.container}>
      <Pressable style={styles.tombolIkon}>
        <Ionicons name="arrow-back" size={24} color="#333333" />
      </Pressable>
      <Text style={styles.judul}>nama item</Text>
      <Pressable style={styles.tombolIkon}>
        <Ionicons name="trash-outline" size={24} color="#FF6347" />
      </Pressable>
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
    zIndex: -1, // Agar tidak menimpa tombol
  },
  tombolIkon: {
    padding: 8,
  },
});
