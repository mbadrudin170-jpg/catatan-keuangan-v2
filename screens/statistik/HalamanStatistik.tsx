// screens/statistik/HalamanStatistik.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterPeriode } from './FilterPeriode';
import { HeaderStatistik } from './HeaderStatistik';
import { WARNA } from './konstanta';
import { RingkasanDompet } from './RingkasanDompet';
import { RingkasanKategori } from './RingkasanKategori';
import { RingkasanKeuangan } from './RingkasanKeuangan';
import { StatistikProvider } from './StatistikContext';
import { TransaksiTerakhir } from './TransaksiTerakhir';

// Komponen Konten dipisah agar bisa mengakses context dari Provider
const KontenStatistik = () => {
  // Tidak ada lagi data yang perlu diambil di sini.
  // Semua komponen anak mengambil datanya sendiri dari context.
  return (
    <SafeAreaView style={styles.wadah}>
      <HeaderStatistik />
      <ScrollView contentContainerStyle={styles.wadahKonten}>
        {/* Semua komponen di bawah ini sekarang mengambil data dari context */}
        <FilterPeriode />
        <RingkasanKeuangan />
        <RingkasanKategori />
        <RingkasanDompet />
        <TransaksiTerakhir />
      </ScrollView>
    </SafeAreaView>
  );
};

// Komponen utama sekarang hanya bertugas menyediakan Context
export const HalamanStatistik = () => (
  <StatistikProvider>
    <KontenStatistik />
  </StatistikProvider>
);

const styles = StyleSheet.create({
  wadah: {
    flex: 1,
    backgroundColor: WARNA.BG,
  },
  wadahKonten: {
    paddingBottom: 24, // Memberi ruang di bagian bawah
  },
});
