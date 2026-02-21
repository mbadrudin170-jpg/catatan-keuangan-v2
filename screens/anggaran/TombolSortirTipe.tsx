// ~/catatan-keuangan-v2/screens/anggaran/TombolSortirTipe.tsx
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { TipePeriode } from '@/database/tipe';

// Tipe untuk filter, sengaja ditambahkan 'semua' untuk opsi melihat semua periode.
export type FilterPeriode = TipePeriode | 'semua';

// Daftar periode yang akan ditampilkan sebagai tombol filter.
// Diurutkan sesuai preferensi tampilan.
const daftarFilter: FilterPeriode[] = [
  'semua',
  'harian',
  'mingguan',
  'bulanan',
  'tahunan',
  'sekali',
];

interface Props {
  periodeAktif: FilterPeriode;
  onPilihPeriode: (periode: FilterPeriode) => void;
}

export default function TombolSortirTipe({
  periodeAktif,
  onPilihPeriode,
}: Props) {
  return (
    <View style={gaya.wadah}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={gaya.kontenScroll}
      >
        {daftarFilter.map((periode) => (
          <Pressable
            key={periode}
            style={[
              gaya.tombol,
              periodeAktif === periode && gaya.tombolAktif,
            ]}
            onPress={() => onPilihPeriode(periode)}
          >
            <Text
              style={[
                gaya.teksTombol,
                periodeAktif === periode && gaya.teksTombolAktif,
              ]}
            >
              {/* Mengubah huruf pertama menjadi kapital untuk tampilan */}
              {periode.charAt(0).toUpperCase() + periode.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  kontenScroll: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  tombol: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
    justifyContent: 'center',
  },
  tombolAktif: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  teksTombol: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  teksTombolAktif: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
