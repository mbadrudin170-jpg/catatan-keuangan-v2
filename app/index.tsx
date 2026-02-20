// app/index.tsx
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { JSX } from 'react';

export default function Index(): JSX.Element {
  return (
    <SafeAreaView style={gaya.penampung}>
      <View style={gaya.header}>
        <Text style={gaya.judul}>Halaman Debug</Text>
        <Text style={gaya.subjudul}>Pilih halaman di bawah ini untuk mengujinya secara cepat</Text>
      </View>

      <View style={gaya.konten}>
        <Link href="/(tabs)/transaksi" asChild>
          <Pressable style={gaya.tombol}>
            <Text style={gaya.teksTombol}>Riwayat Transaksi (Tab)</Text>
          </Pressable>
        </Link>
        <Link href="/(form)/form-transaksi" asChild>
          <Pressable style={gaya.tombol}>
            <Text style={gaya.teksTombol}>Form Transaksi</Text>
          </Pressable>
        </Link>
        <Link href="/(form)/form-dompet" asChild>
          <Pressable style={gaya.tombol}>
            <Text style={gaya.teksTombol}>Form Dompet</Text>
          </Pressable>
        </Link>
        <Link href="/(form)/form-kategori" asChild>
          <Pressable style={gaya.tombol}>
            <Text style={gaya.teksTombol}>Form Kategori</Text>
          </Pressable>
        </Link>
        {/* DIUBAH: Mengarahkan ke rute yang benar setelah file dipindahkan */}
        <Link href="/(tabs)/kategori" asChild>
          <Pressable style={gaya.tombol}>
            <Text style={gaya.teksTombol}>Kategori (Tab)</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Latar belakang abu-abu muda
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef', // Garis pemisah tipis
  },
  judul: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529', // Hitam pekat
    marginBottom: 8,
  },
  subjudul: {
    fontSize: 16,
    color: '#6c757d', // Abu-abu sekunder
  },
  konten: {
    padding: 24,
    gap: 16, // Jarak antar tombol
  },
  tombol: {
    backgroundColor: '#ffffff', // Tombol putih
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  teksTombol: {
    color: '#007bff', // Teks biru primer
    fontSize: 16,
    fontWeight: '600',
  },
});
