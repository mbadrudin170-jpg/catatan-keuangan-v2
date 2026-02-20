// screens/form-kategori/ListSubKategori.tsx
import type { Kategori, Subkategori } from '@/database/tipe';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TombolAksi from './TombolAksi';

interface ListSubKategoriProps {
  kategoriTerpilih: Kategori | null;
  subkategori: Subkategori[];
  tambahSubkategori: (nama: string, kategoriId: number) => void;
  hapusSubkategori: (id: number) => void;
  perbaruiSubkategori: (id: number, nama: string) => void;
}

export default function ListSubKategori({
  kategoriTerpilih,
  subkategori,
  tambahSubkategori,
  hapusSubkategori,
}: // perbaruiSubkategori belum digunakan di UI ini
ListSubKategoriProps) {
  if (!kategoriTerpilih) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>
          Pilih kategori terlebih dahulu untuk melihat sub-kategori.
        </Text>
      </View>
    );
  }

  const handleTambahSubkategori = (nama: string) => {
    if (kategoriTerpilih) {
      tambahSubkategori(nama, kategoriTerpilih.id);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Sub-Kategori untuk {kategoriTerpilih.nama}</Text>
      {subkategori.length === 0 ? (
        <Text style={styles.infoText}>Belum ada sub-kategori.</Text>
      ) : (
        subkategori.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.nama}</Text>
            {/* Di sini bisa ditambahkan tombol untuk edit/hapus per item */}
          </View>
        ))
      )}
      <TombolAksi
        nama="Sub-Kategori"
        onTambah={handleTambahSubkategori}
        onHapus={() => {}} // Hapus per item, bukan massal
        placeholder="Nama Sub-Kategori Baru"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    paddingVertical: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
});
