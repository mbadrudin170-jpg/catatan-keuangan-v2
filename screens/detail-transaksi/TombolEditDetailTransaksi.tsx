// screens/detail-transaksi/TombolEditDetailTransaksi.tsx
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function TombolEditDetailTransaksi() {
  // Ambil ID transaksi dari parameter URL agar tahu data mana yang akan di-edit
  const { id } = useLocalSearchParams<{ id: string }>();

  const bukaFormEdit = () => {
    // Arahkan ke form, kirim ID transaksi sebagai parameter
    router.push({
      pathname: '/(form)/form-transaksi',
      params: { id },
    });
  };

  return (
    <Pressable onPress={bukaFormEdit} style={gaya.tombolIkon}>
      {/* Menggunakan ikon 'edit' dari AntDesign untuk konsistensi */}
      <AntDesign name="edit" size={24} color="#333333" />
    </Pressable>
  );
}

const gaya = StyleSheet.create({
  tombolIkon: {
    padding: 8,
  },
});
