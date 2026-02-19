// screens/kategori/TombolTambahKategori.tsx
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TombolTambahKategori() {
  return (
    <View style={styles.wadah}>
      <Pressable
        style={styles.tombol}
        onPress={() => router.push('/(form)/form-kategori')}
      >
        <Text style={styles.teksTombol}>Tambah / Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    // Menghapus position: 'absolute' agar tombol menjadi bagian dari alur normal
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tombol: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teksTombol: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
