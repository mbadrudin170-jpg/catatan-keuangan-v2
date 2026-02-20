// screens/detail-dompet/TombolHapusDetailDompet.tsx
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable } from 'react-native';

import { useDetailDompet } from './logikaDetailDompet';

export default function TombolHapusDetailDompet() {
  const { dompet, hapusDompet } = useDetailDompet();
  const navigasi = useNavigation();

  if (!dompet) {
    return null; // Jangan render apapun jika data dompet belum siap
  }

  const konfirmasiHapus = () => {
    Alert.alert(
      'Hapus Dompet',
      'Apakah Anda yakin ingin menghapus dompet ini? Tindakan ini tidak akan menghapus transaksi terkait.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await hapusDompet(dompet.id);
              // Kembali ke halaman sebelumnya setelah berhasil menghapus
              if (navigasi.canGoBack()) {
                navigasi.goBack();
              } else {
                // Fallback jika tidak bisa kembali (misal deep link)
                router.replace('/dompet');
              }
            } catch (error) {
              console.error('Gagal menghapus dompet:', error);
              Alert.alert('Error', 'Gagal menghapus dompet. Silakan coba lagi.');
            }
          },
        },
      ]
    );
  };

  return (
    <Pressable onPress={konfirmasiHapus} style={{ marginRight: 15 }}>
      <AntDesign name="delete" size={24} color="red" />
    </Pressable>
  );
}
