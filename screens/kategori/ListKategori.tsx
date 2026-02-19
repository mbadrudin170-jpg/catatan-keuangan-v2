// screens/kategori/ListKategori.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useKategori } from '../../context/KategoriContext';
import { Kategori, Subkategori } from '../../database/tipe';

export default function ListKategori() {
  const { daftarKategori } = useKategori();

  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori | null>(null);

  useEffect(() => {
    if (daftarKategori && daftarKategori.length > 0) {
      setKategoriTerpilih(daftarKategori[0]);
    } else {
      setKategoriTerpilih(null);
    }
  }, [daftarKategori]);

  const daftarSubKategori = kategoriTerpilih?.subkategori || [];

  const renderKategoriItem = ({ item }: { item: Kategori }) => {
    const isSelected = kategoriTerpilih?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.kategoriItem, isSelected && styles.kategoriItemSelected]}
        activeOpacity={0.85}
        onPress={() => setKategoriTerpilih(item)}
      >
        <Text style={[styles.kategoriText, isSelected && styles.kategoriTextSelected]}>
          {item.nama}
        </Text>
      </TouchableOpacity>
    );
  };

  // --- DIPERBAIKI: Menggunakan tipe Subkategori dari tipe database ---
  const renderSubKategoriItem = ({ item }: { item: Subkategori }) => {
    return (
      <View style={styles.subKategoriItem}>
        <Text style={styles.subKategoriText}>{item.nama}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.kategoriContainer}>
        <FlatList
          data={daftarKategori}
          renderItem={renderKategoriItem}
          // --- DIPERBAIKI: Konversi ID number ke string ---
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paddingHorizontalList}
          ListEmptyComponent={<Text style={styles.emptyText}>Belum ada kategori.</Text>}
        />
      </View>

      <View style={styles.subKategoriContainer}>
        <Text style={styles.subKategoriHeader}>
          Sub-kategori untuk:{' '}
          <Text style={styles.subKategoriNama}>{kategoriTerpilih?.nama || 'Pilih Kategori'}</Text>
        </Text>

        <FlatList
          data={daftarSubKategori}
          renderItem={renderSubKategoriItem}
          // --- DIPERBAIKI: Konversi ID number ke string ---
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.paddingList}
          ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada sub-kategori.</Text>}
        />
      </View>
    </View>
  );
}

// Gaya tidak berubah
const warna = {
  primer: '#4F46E5',
  border: '#e2e8f0',
  latar: '#f8fafc',
  teksUtama: '#0f172a',
  teksSekunder: '#64748b',
  permukaan: '#ffffff',
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  kategoriContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
  },
  paddingHorizontalList: {
    paddingRight: 6,
  },
  kategoriItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: warna.border,
    marginRight: 10,
    backgroundColor: warna.permukaan,
  },
  kategoriItemSelected: {
    backgroundColor: warna.primer,
    borderColor: warna.primer,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  kategoriText: {
    fontSize: 14,
    fontWeight: '600',
    color: warna.teksUtama,
  },
  kategoriTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  subKategoriContainer: {
    paddingTop: 18,
  },
  subKategoriHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
    color: warna.teksSekunder,
  },
  subKategoriNama: {
    color: warna.teksUtama,
    fontWeight: '700',
  },
  paddingList: {
    paddingBottom: 20,
  },
  subKategoriItem: {
    backgroundColor: warna.permukaan,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: warna.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subKategoriText: {
    fontSize: 15,
    fontWeight: '500',
    color: warna.teksUtama,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: warna.teksSekunder,
    paddingHorizontal: 20,
    fontSize: 14,
  },
});
