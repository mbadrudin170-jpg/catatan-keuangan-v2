// screens/form-transaksi/HeaderFormTransaksi.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderFormTransaksi() {
  return (
    <View style={gaya.penampung}>
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <Text style={gaya.teksJudul}>Tambah Transaksi</Text>
    </View>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  teksJudul: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});
