// screens/anggaran/ScreenAnggaran.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ambilSemuaAnggaranDenganRincian, hapusSemuaAnggaran } from '@/database/operasi';
import type { Anggaran } from '@/database/tipe';
import HeaderAnggaran from './HeaderAnggaran';
import ListAnggaran from './LIstAnggaran';
import TombolSortirTipe, { type FilterPeriode } from './TombolSortirTipe'; // Impor komponen filter
import TombolTambahAnggaran from './TombolTambahAnggaran';

export default function ScreenAnggaran() {
  const [semuaAnggaran, setSemuaAnggaran] = useState<Anggaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // State untuk menyimpan filter periode yang aktif
  const [filterAktif, setFilterAktif] = useState<FilterPeriode>('semua');

  // Memuat data dari database
  useFocusEffect(
    useCallback(() => {
      const muatAnggaran = async () => {
        try {
          const data = await ambilSemuaAnggaranDenganRincian();
          setSemuaAnggaran(data);
        } catch (error) {
          console.error('Gagal memuat daftar anggaran:', error);
        } finally {
          setIsLoading(false);
        }
      };

      setIsLoading(true);
      muatAnggaran();
    }, [])
  );

  // Logika untuk menyaring anggaran berdasarkan filter yang aktif.
  // useMemo digunakan agar proses filter tidak berjalan di setiap render.
  const anggaranTersaring = useMemo(() => {
    if (filterAktif === 'semua') {
      return semuaAnggaran; // Tampilkan semua jika filter 'semua'
    }
    // Filter daftar anggaran berdasarkan periode yang cocok
    return semuaAnggaran.filter((anggaran) => anggaran.periode === filterAktif);
  }, [semuaAnggaran, filterAktif]);

  // Fungsi untuk menangani penghapusan semua anggaran
  const handleHapusSemua = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus semua data anggaran? Aksi ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await hapusSemuaAnggaran();
              setSemuaAnggaran([]); // Kosongkan state utama
              Alert.alert('Berhasil', 'Semua anggaran telah dihapus.');
            } catch (error) {
              console.error('Gagal menghapus semua anggaran:', error);
              Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus anggaran.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={gaya.penampung}>
      <View style={gaya.penampung}>
        <HeaderAnggaran
          onHapusSemua={handleHapusSemua}
          tampilkanTombolHapus={semuaAnggaran.length > 0}
        />

        {/* Tambahkan komponen filter di sini */}
        <TombolSortirTipe periodeAktif={filterAktif} onPilihPeriode={setFilterAktif} />

        {isLoading ? (
          <ActivityIndicator style={{ flex: 1 }} size="large" color="#007bff" />
        ) : (
          // Gunakan data yang sudah difilter untuk ditampilkan
          <ListAnggaran anggaran={anggaranTersaring} setAnggaran={setSemuaAnggaran} />
        )}
      </View>
      <TombolTambahAnggaran />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
