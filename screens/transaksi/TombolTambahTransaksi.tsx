// screens/transaksi/TombolTambahTransaksi.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function TombolTambahTransaksi() {
  return (
    <Pressable
      testID="tombol-tambah-transaksi" // Ditambahkan untuk pengujian
      style={({ pressed }) => [gaya.tombol, pressed && gaya.tombolDitekan]}
      onPress={() => router.push('/(form)/form-transaksi')}
    >
      <Ionicons name="add" size={32} color="white" />
    </Pressable>
  );
}

const gaya = StyleSheet.create({
  tombol: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tombolDitekan: {
    opacity: 0.8,
  },
});
