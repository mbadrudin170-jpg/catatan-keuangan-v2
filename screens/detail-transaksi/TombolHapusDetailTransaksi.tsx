import { AntDesign } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React from 'react';
import { Alert, Pressable } from 'react-native';

import { useTransaksi } from '@/context/TransaksiContext';
import { useDetailTransaksi } from './logikaDetailTransaksi';

export default function TombolHapusDetailTransaksi() {
  const navigasi = useNavigation();
  const data = useDetailTransaksi();
  const { hapusSatuTransaksi } = useTransaksi(); // Ganti nama fungsi di sini

  // Jangan render tombol jika data transaksi belum siap
  if (!data) {
    return null;
  }

  const konfirmasiHapus = () => {
    Alert.alert(
      'Hapus Transaksi',
      'Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat diurungkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              // Panggil fungsi yang benar
              await hapusSatuTransaksi(data.transaksi.id);

              // Kembali ke halaman sebelumnya setelah berhasil menghapus
              if (navigasi.canGoBack()) {
                navigasi.goBack();
              } else {
                // Fallback jika tidak bisa kembali
                router.replace('/(tabs)/transaksi');
              }
            } catch (error) {
              console.error('Gagal menghapus transaksi:', error);
              Alert.alert('Error', 'Gagal menghapus transaksi. Silakan coba lagi.');
            }
          },
        },
      ]
    );
  };

  return (
    <Pressable onPress={konfirmasiHapus} style={{ marginRight: 15 }}>
      <AntDesign name="delete" size={24} color="#ef4444" />
    </Pressable>
  );
}
