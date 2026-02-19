// screens/dompet/HeaderDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderDompet() {
  return (
    <View style={gaya.wadah}>
      <Pressable onPress={() => router.back()} style={gaya.tombolKembali}>
        <Ionicons name="arrow-back" size={24} color={warna.teksUtama} />
      </Pressable>
      <Text style={gaya.judul}>Daftar Dompet</Text>
    </View>
  );
}

const warna = {
  latar: '#ffffff',
  teksUtama: '#1f2937', // Warna abu-abu gelap untuk teks
  border: '#e5e7eb', // Warna abu-abu terang untuk garis batas
};

const gaya = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: warna.latar,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    gap: 16, // Memberi jarak antara tombol kembali dan judul
  },
  tombolKembali: {
    padding: 4,
  },
  judul: {
    fontSize: 20,
    fontWeight: 'bold',
    color: warna.teksUtama,
  },
});
