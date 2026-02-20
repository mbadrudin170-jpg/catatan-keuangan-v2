// screens/dompet/HeaderDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { useDompet } from '@/context/DompetContext';

export default function HeaderDompet() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idDompet = id ? Number(id) : undefined;

  const { hapusSemuaDompet, daftarDompet } = useDompet();

  const dompetSaatIni = daftarDompet.find((d) => d.id === idDompet);
  const judul = dompetSaatIni?.nama || 'Daftar Dompet';

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

  const handleHapusSemua = () => {
    hapusSemuaDompet();
    router.replace('/dompet');
  };

  const hapusNonaktif = !!idDompet;

  return (
    <View style={gaya.wadah}>
      <View style={gaya.grupKiri}>
        <Text style={gaya.judul} numberOfLines={1} ellipsizeMode="tail">
          {judul}
        </Text>
      </View>

      <Pressable
        onPress={konfirmasiHapusSemua}
        style={({ pressed }) => [
          gaya.tombol,
          pressed && !hapusNonaktif && gaya.tombolTekan,
          hapusNonaktif && gaya.tombolNonaktif,
        ]}
        disabled={hapusNonaktif}
        android_ripple={!hapusNonaktif ? { color: warna.abuRipple, borderless: true } : undefined}
      >
        <Ionicons
          name="trash-outline"
          size={24}
          color={hapusNonaktif ? warna.abuMuda : warna.merah}
        />
      </Pressable>
    </View>
  );
}

// Konstanta warna dengan nama deskriptif dalam bahasa Indonesia
const warna = {
  latar: '#ffffff',
  teksUtama: '#1f2937', // abu-abu gelap untuk judul
  border: '#e5e7eb',
  merah: '#dc2626', // merah lebih terang untuk aksen hapus
  abuMuda: '#d1d5db', // abu-abu untuk ikon nonaktif
  abuRipple: '#9ca3af', // efek ripple saat ditekan
  bayangan: '#000000',
};

const gaya = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12, // sedikit dikurangi agar lebih proporsional
    backgroundColor: warna.latar,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    // Bayangan halus untuk kedalaman (opsional, cocok untuk iOS)
    shadowColor: warna.bayangan,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // untuk Android
  },
  grupKiri: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 8, // beri jarak dengan tombol
  },
  judul: {
    fontSize: 20,
    fontWeight: '600', // semi-bold lebih modern
    color: warna.teksUtama,
    flexShrink: 1,
  },
  tombol: {
    padding: 8, // area sentuh lebih luas
    borderRadius: 20, // bentuk melingkar
    minWidth: 40, // ukuran minimum untuk aksesibilitas
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tombolTekan: {
    backgroundColor: '#f3f4f6', // efek latar saat ditekan
  },
  tombolNonaktif: {
    // tidak ada latar, hanya ikon yang berubah warna
  },
});
