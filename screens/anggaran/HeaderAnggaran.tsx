import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  onHapusSemua: () => void;
  tampilkanTombolHapus: boolean; // Prop untuk mengontrol visibilitas tombol
}

export default function HeaderAnggaran({ onHapusSemua, tampilkanTombolHapus }: Props) {
  return (
    <View style={gaya.penampungHeader}>
      <Text style={gaya.judulHeader}>Anggaran</Text>
      {/* Tombol hapus hanya muncul jika prop-nya true */}
      {tampilkanTombolHapus && (
        <Pressable onPress={onHapusSemua}>
          <Ionicons name="trash-outline" size={24} color="#dc3545" />
        </Pressable>
      )}
    </View>
  );
}

const gaya = StyleSheet.create({
  penampungHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  judulHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
  },
});
