// ~/catatan-keuangan-v2/screens/form-anggaran/HeaderFormAnggaran.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  isEdit: boolean;
}

export default function HeaderFormAnggaran({ isEdit }: Props) {
  return (
    <View style={gaya.header}>
      <Pressable onPress={() => router.back()} style={gaya.tombolKembali}>
        <Ionicons name="arrow-back" size={24} color="#343A40" />
      </Pressable>
      <Text style={gaya.judul}>{isEdit ? 'Edit Anggaran' : 'Tambah Anggaran'}</Text>
    </View>
  );
}

const gaya = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DEE2E6',
    backgroundColor: '#FFFFFF',
  },
  tombolKembali: {
    marginRight: 16,
  },
  judul: {
    fontSize: 20,
    fontWeight: '600',
    color: '#343A40',
  },
});
