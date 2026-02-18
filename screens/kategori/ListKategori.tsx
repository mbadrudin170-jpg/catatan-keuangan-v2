// screens/kategori/ListKategori.tsx
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useKategori } from '@/context/KategoriContext';

export default function ListKategori() {
  const {
    daftarKategori,
    kategoriTerpilih,
    pilihKategori,
    daftarSubKategori,
  } = useKategori();

  const renderKategoriItem = ({
    item,
  }: {
    item: { id: string; nama: string };
  }) => {
    const isSelected = kategoriTerpilih?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.kategoriItem, isSelected && styles.kategoriItemSelected]}
        onPress={() => pilihKategori(item.id)}
      >
        <Text
          style={[
            styles.kategoriText,
            isSelected && styles.kategoriTextSelected,
          ]}
        >
          {item.nama}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSubKategoriItem = ({
    item,
  }: {
    item: { id: string; nama: string };
  }) => {
    return (
      <View style={styles.subKategoriItem}>
        <Text style={styles.subKategoriText}>{item.nama}</Text>
      </View>
    );
  };

  return (
    // Menghapus flex: 1 agar komponen ini tidak mendorong tombol ke luar layar
    <View style={styles.container}>
      {/* Daftar Kategori */}
      <View style={styles.kategoriContainer}>
        <FlatList
          data={daftarKategori}
          renderItem={renderKategoriItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Belum ada kategori.</Text>
          }
        />
      </View>

      {/* Daftar Sub Kategori */}
      <View style={styles.subKategoriContainer}>
        <Text style={styles.subKategoriHeader}>
          Sub-kategori untuk: {kategoriTerpilih?.nama || 'Pilih Kategori'}
        </Text>
        <FlatList
          data={daftarSubKategori}
          renderItem={renderSubKategoriItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada sub-kategori.</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    // flex: 1 telah dihapus dari sini
  },
  kategoriContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  kategoriItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007bff',
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  kategoriItemSelected: {
    backgroundColor: '#007bff',
  },
  kategoriText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  kategoriTextSelected: {
    color: '#fff',
  },
  subKategoriContainer: {
    // Menggunakan flexGrow agar bisa scroll jika konten banyak, tapi tidak mendorong komponen lain
    flexGrow: 1,
    paddingTop: 15,
  },
  subKategoriHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subKategoriItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  subKategoriText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    paddingHorizontal: 20,
  },
});
