// screens/form-anggaran/TombolTambahAnggaran.tsx
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function TombolTambahAnggaran() {
  return (
    <Link href="/(form)/form-anggaran" asChild>
      <Pressable style={gaya.tombol}>
        <Text style={gaya.teksTombol}>+ Tambah Anggaran Baru</Text>
      </Pressable>
    </Link>
  );
}

const gaya = StyleSheet.create({
  tombol: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  teksTombol: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
