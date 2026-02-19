// screens/transaksi/HeaderTransaksi.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderTransaksi() {
  return (
    <View style={gaya.penampung}>
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Pressable>
      <Text style={gaya.judul}>Riwayat Transaksi</Text>
    </View>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 16,
  },
  judul: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
