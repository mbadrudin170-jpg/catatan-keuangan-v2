// screens/form-kategori/TombolTipe.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useKategori } from '../../context/KategoriContext';

export default function TombolTipe() {
  const { tipeAktif, setTipeAktif } = useKategori();

  return (
    <View style={gaya.penampungTombol}>
      <Pressable
        style={({ pressed }) => [
          gaya.tombol,
          // --- DIPERBAIKI: Menggunakan 'pemasukan' (huruf kecil) ---
          tipeAktif === 'pemasukan' && gaya.aktifPemasukkan,
          pressed && gaya.tombolTekan,
        ]}
        // --- DIPERBAIKI: Menggunakan 'pemasukan' (huruf kecil) ---
        onPress={() => setTipeAktif('pemasukan')}
      >
        <Text style={[gaya.teksTombol, tipeAktif === 'pemasukan' && gaya.teksAktifPemasukkan]}>
          Pemasukkan
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          gaya.tombol,
          // --- DIPERBAIKI: Menggunakan 'pengeluaran' (huruf kecil) ---
          tipeAktif === 'pengeluaran' && gaya.aktifPengeluaran,
          pressed && gaya.tombolTekan,
        ]}
        // --- DIPERBAIKI: Menggunakan 'pengeluaran' (huruf kecil) ---
        onPress={() => setTipeAktif('pengeluaran')}
      >
        <Text style={[gaya.teksTombol, tipeAktif === 'pengeluaran' && gaya.teksAktifPengeluaran]}>
          Pengeluaran
        </Text>
      </Pressable>
    </View>
  );
}

// Gaya tidak berubah, jadi saya biarkan seperti adanya.
const gaya = StyleSheet.create({
  penampungTombol: {
    flexDirection: 'row',
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 6,
    marginVertical: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ECEFF3',
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  tombol: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tombolTekan: {
    transform: [{ scale: 0.995 }],
    opacity: 0.98,
  },
  aktifPemasukkan: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFF7E6',
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  aktifPengeluaran: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFE6E6',
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  teksTombol: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'none',
  },
  teksAktifPemasukkan: {
    color: '#0F9D58',
    fontWeight: '700',
  },
  teksAktifPengeluaran: {
    color: '#D93025',
    fontWeight: '700',
  },
});
