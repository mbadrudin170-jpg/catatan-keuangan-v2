// screens/kategori/TombolTipe.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useKategori } from '@/context/KategoriContext';

export default function TombolTipe() {
  const { tipeAktif, setTipeAktif } = useKategori();

  return (
    <View style={styles.wadah}>
      <TouchableOpacity
        style={[
          styles.tombol,
          tipeAktif === 'Pemasukkan' && styles.tombolPemasukkanAktif,
        ]}
        onPress={() => setTipeAktif('Pemasukkan')}
      >
        <Text
          style={[
            styles.teks,
            tipeAktif === 'Pemasukkan' && styles.teksAktif,
          ]}
        >
          Pemasukkan
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tombol,
          tipeAktif === 'Pengeluaran' && styles.tombolPengeluaranAktif,
        ]}
        onPress={() => setTipeAktif('Pengeluaran')}
      >
        <Text
          style={[
            styles.teks,
            tipeAktif === 'Pengeluaran' && styles.teksAktif,
          ]}
        >
          Pengeluaran
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
  },
  tombol: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tombolPemasukkanAktif: {
    backgroundColor: '#28a745', // Warna hijau untuk pemasukkan
  },
  tombolPengeluaranAktif: {
    backgroundColor: '#dc3545', // Warna merah untuk pengeluaran
  },
  teks: {
    color: '#000',
    fontWeight: 'bold',
  },
  teksAktif: {
    color: '#fff',
  },
});
