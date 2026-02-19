// screens/kategori/TombolTipe.tsx
import { useKategori } from '../../context/KategoriContext'; // Perbaiki path import
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TombolTipe() {
  const { tipeAktif, setTipeAktif } = useKategori();

  return (
    <View style={styles.wadah}>
      {/* --- DIPERBAIKI: Menggunakan string "pemasukan" (huruf kecil) --- */}
      <TouchableOpacity
        style={[styles.tombol, tipeAktif === 'pemasukan' && styles.tombolPemasukkanAktif]}
        activeOpacity={0.85}
        onPress={() => setTipeAktif('pemasukan')}
      >
        <Text style={[styles.teks, tipeAktif === 'pemasukan' && styles.teksAktif]}>
          Pemasukkan
        </Text>
      </TouchableOpacity>

      {/* --- DIPERBAIKI: Menggunakan string "pengeluaran" (huruf kecil) --- */}
      <TouchableOpacity
        style={[styles.tombol, tipeAktif === 'pengeluaran' && styles.tombolPengeluaranAktif]}
        activeOpacity={0.85}
        onPress={() => setTipeAktif('pengeluaran')}
      >
        <Text style={[styles.teks, tipeAktif === 'pengeluaran' && styles.teksAktif]}>
          Pengeluaran
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Gaya tidak berubah
const warna = {
  latar: '#f8fafc',
  border: '#e2e8f0',
  pemasukkan: '#22c55e',
  pengeluaran: '#ef4444',
  teksUtama: '#0f172a',
};

const styles = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    backgroundColor: warna.latar,
    borderRadius: 16,
    padding: 6,
    gap: 8,
    borderWidth: 1,
    borderColor: warna.border,
  },
  tombol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  tombolPemasukkanAktif: {
    backgroundColor: warna.pemasukkan,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  tombolPengeluaranAktif: {
    backgroundColor: warna.pengeluaran,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  teks: {
    fontSize: 14,
    fontWeight: '600',
    color: warna.teksUtama,
  },
  teksAktif: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
