import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Anggaran } from '@/database/tipe';
import { formatMataUang } from '@/utils/formatMataUang';

interface Props {
  anggaran: Anggaran[]; // Terima data anggaran sebagai props
}

// Fungsi untuk menghitung total pemakaian dari rincian
const hitungTotalTerpakai = (rincian: any[] = []) => {
  // Implementasi ini mungkin perlu disesuaikan saat data terpakai sudah ada
  return rincian.reduce((total, item) => total + (item.terpakai || 0), 0);
};

export default function ListAnggaran({ anggaran }: Props) {
  const handlePress = (id: number) => {
    router.push(`/anggaran/${id}`);
  };

  if (anggaran.length === 0) {
    return (
      <View style={gaya.wadahKosong}>
        <Text style={gaya.teksKosong}>Belum ada anggaran yang dibuat.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={gaya.wadah}>
      {anggaran.map(item => {
        const terpakai = hitungTotalTerpakai(item.rincian);
        const sisa = item.total_anggaran - terpakai;
        const persentase = item.total_anggaran > 0 ? (terpakai / item.total_anggaran) * 100 : 0;

        return (
          <Pressable key={item.id} style={gaya.kartu} onPress={() => handlePress(item.id)}>
            <View style={gaya.infoKiri}>
              <Text style={gaya.namaKategori}>{item.nama_kategori}</Text>
              <Text style={gaya.periode}>Periode: {item.periode}</Text>
              <View style={gaya.barProgress}>
                <View style={[gaya.barProgressTerisi, { width: `${persentase}%` }]} />
              </View>
              <Text style={gaya.teksProgress}>
                {formatMataUang(terpakai)} / {formatMataUang(item.total_anggaran)}
              </Text>
            </View>
            <View style={gaya.infoKanan}>
              <Text style={gaya.sisaLabel}>Sisa</Text>
              <Text style={[gaya.sisaJumlah, sisa < 0 && gaya.sisaMinus]}>
                {formatMataUang(sisa)}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  wadahKosong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teksKosong: {
    fontSize: 16,
    color: '#6c757d',
  },
  kartu: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  infoKiri: {
    flex: 1,
    marginRight: 10,
  },
  infoKanan: {
    alignItems: 'flex-end',
  },
  namaKategori: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
  },
  periode: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  barProgress: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barProgressTerisi: {
    height: '100%',
    backgroundColor: '#007bff',
  },
  teksProgress: {
    fontSize: 12,
    color: '#6c757d',
  },
  sisaLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  sisaJumlah: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  sisaMinus: {
    color: '#dc3545',
  },
});
