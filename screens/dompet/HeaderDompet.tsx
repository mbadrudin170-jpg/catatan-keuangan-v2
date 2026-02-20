// screens/dompet/HeaderDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { useDompet } from '@/context/DompetContext';
{
  /** ask:  kenapa file ini tidak import database/tipe.ts 
 baca dahulu file  GEMINI.md
ini file terbaru yang sudah saya modifikasi jadi kamu gunakan data ini jangan gunakan data yang tersimpan di memori kamu
 selalu tulis kan jalur path file di paling atas setiap file
 tolong untuk penamaan variabel dan kunci usahakan gunakan bahasa indonesia terkecuali bahasa inggris nya yang sudah umum baru gunakana bahasa inggris nya
 */
}
export default function HeaderDompet() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idDompet = id ? Number(id) : undefined;

  // Mengambil fungsi hapusSemuaDompet dari konteks
  const { hapusSemuaDompet, daftarDompet } = useDompet();

  const dompetSaatIni = daftarDompet.find((d) => d.id === idDompet);

  const judul = dompetSaatIni?.nama || 'Daftar Dompet';

  // Fungsi baru untuk konfirmasi hapus semua dompet
  const konfirmasiHapusSemua = () => {
    Alert.alert(
      'Hapus Semua Dompet',
      'Apakah Anda yakin ingin menghapus semua dompet? Aksi ini akan menghapus seluruh data dompet dan tidak dapat diurungkan.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus Semua', onPress: handleHapusSemua, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  // Fungsi baru untuk menangani aksi hapus semua
  const handleHapusSemua = () => {
    hapusSemuaDompet();
    // Kembali ke halaman utama setelah semua terhapus
    router.replace('/dompet');
  };

  // Tombol hapus hanya aktif di halaman daftar (saat tidak ada idDompet)
  const hapusNonaktif = !!idDompet;

  return (
    <View style={gaya.wadah}>
      <View style={gaya.grupKiri}>
        <Text style={gaya.judul} numberOfLines={1} ellipsizeMode="tail">
          {judul}
        </Text>
      </View>

      <Pressable onPress={konfirmasiHapusSemua} style={gaya.tombol} disabled={hapusNonaktif}>
        <Ionicons
          name="trash-outline"
          size={22}
          color={hapusNonaktif ? warna.abuabu : warna.merah}
        />
      </Pressable>
    </View>
  );
}

const warna = {
  latar: '#ffffff',
  teksUtama: '#1f2937',
  border: '#e5e7eb',
  merah: '#ef4444',
  abuabu: '#cccccc',
};

const gaya = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: warna.latar,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
  },
  grupKiri: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tombol: {
    padding: 4,
  },
  judul: {
    fontSize: 20,
    fontWeight: 'bold',
    color: warna.teksUtama,
    flexShrink: 1,
  },
});
