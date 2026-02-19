// screens/transaksi/TombolTambahTransaksi.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function TombolTambahTransaksi() {
  const navigasiKeFormTambah = () => {
    // --- DIPERBAIKI: Menggunakan rute yang benar ---
    router.push('/(form)/form-transaksi');
  };

  return (
    <Pressable style={styles.container} onPress={navigasiKeFormTambah}>
      <Ionicons name="add" size={32} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
