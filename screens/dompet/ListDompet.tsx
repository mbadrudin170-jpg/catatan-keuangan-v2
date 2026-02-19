// screens/dompet/ListDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import type { Dompet } from '@/database/tipe'; // Impor tipe Dompet untuk keamanan tipe
import { formatAngka } from '@/utils/format/FormatAngka';
import { useLogikaDompet } from '@/screens/dompet/logikaDompet';

export default function ListDompet() {
  const { seksiData, memuat, daftarDompet } = useLogikaDompet();

  if (memuat) {
    return <ActivityIndicator size="large" color={warna.primer} style={{ marginTop: 40 }} />;
  }

  if (daftarDompet.length === 0) {
    return (
      <View style={gaya.wadahKosong}>
        <Ionicons name="wallet-outline" size={60} color={warna.teksSekunder} />
        <Text style={gaya.teksKosong}>Belum ada dompet.</Text>
        <Text style={gaya.teksSubKosong}>Ayo buat dompet pertamamu!</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Dompet }) => (
    <Pressable
      style={({ pressed }) => [gaya.itemWadah, pressed && { opacity: 0.8 }]}
      onPress={() =>
        // PERBAIKAN: Arahkan ke halaman detail dompet dinamis sesuai permintaan
        router.push(`/dompet/${item.id}`)
      }
    >
      <View style={gaya.infoKiri}>
        <View style={gaya.ikonWadah}>
          <Ionicons name={(item.ikon as React.ComponentProps<typeof Ionicons>['name']) || 'wallet'} size={24} color={warna.primer} />
        </View>
        <Text style={gaya.teksNama}>{item.nama}</Text>
      </View>
      <Text style={gaya.teksSaldo}>{formatAngka(item.saldo)}</Text>
    </Pressable>
  );

  // Render header untuk setiap seksi, kini menampilkan judul dan total saldo
  const renderSectionHeader = ({ section }: { section: { judul: string; total: number } }) => (
    <View style={gaya.headerWadah}>
      <Text style={gaya.headerJudul}>{section.judul}</Text>
      <Text style={gaya.headerTotal}>{formatAngka(section.total)}</Text>
    </View>
  );

  return (
    <SectionList
      sections={seksiData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      contentContainerStyle={gaya.wadahList}
      showsVerticalScrollIndicator={false}
    />
  );
}

const warna = {
  latar: '#ffffff',
  primer: '#3b82f6',
  border: '#e5e7eb',
  teksUtama: '#1f2937',
  teksSekunder: '#9ca3af',
  latarIkon: '#eff6ff',
};

const gaya = StyleSheet.create({
  wadahList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  headerWadah: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  headerJudul: {
    fontSize: 14,
    fontWeight: 'bold',
    color: warna.teksSekunder,
    textTransform: 'uppercase',
  },
  headerTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: warna.teksSekunder,
  },
  itemWadah: {
    backgroundColor: warna.latar,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: warna.border,
    marginBottom: 12,
  },
  infoKiri: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ikonWadah: {
    backgroundColor: warna.latarIkon,
    padding: 10,
    borderRadius: 99,
  },
  teksNama: {
    fontSize: 16,
    fontWeight: '600',
    color: warna.teksUtama,
  },
  teksSaldo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: warna.primer,
  },
  wadahKosong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  teksKosong: {
    fontSize: 18,
    fontWeight: '600',
    color: warna.teksSekunder,
    marginTop: 16,
  },
  teksSubKosong: {
    fontSize: 14,
    color: warna.teksSekunder,
    marginTop: 4,
  },
});
