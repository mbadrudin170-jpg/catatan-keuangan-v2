// screens/transaksi/HeaderTransaksi.tsx
import { useTransaksi } from '@/context/TransaksiContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderTransaksi() {
  const { hapusSemuaTransaksi } = useTransaksi();

  const onHapusSemuaTransaksi = () => {
    Alert.alert(
      'Hapus Semua Transaksi',
      'Apakah Anda yakin ingin menghapus semua riwayat transaksi? Tindakan ini tidak dapat diurungkan.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Ya, Hapus',
          onPress: () => hapusSemuaTransaksi(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={gaya.penampung}>
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Pressable>
      <Text style={gaya.judul}>Riwayat Transaksi</Text>
      <Pressable onPress={onHapusSemuaTransaksi}>
        <Ionicons name="trash-outline" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Mengatur jarak antar elemen
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
    textAlign: 'center',
    flex: 1, // Membuat judul mengisi ruang yang tersedia
  },
});
