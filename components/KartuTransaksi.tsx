import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Transaksi } from '@/database/tipe';
import { formatAngka } from '@/utils/format/FormatAngka';

interface Props {
  transaksi: Transaksi;
}

export function KartuTransaksi({ transaksi }: Props) {
  const isPemasukan = transaksi.tipe === 'pemasukan';
  const isTransfer = transaksi.tipe === 'transfer';

  let warnaJumlah = warna.pengeluaran; // Default pengeluaran
  let ikon: keyof typeof Ionicons.glyphMap = 'arrow-up';
  let simbol = '-';
  let namaTampilan = transaksi.keterangan || transaksi.nama_subkategori || transaksi.nama_kategori || 'Transaksi';

  if (isPemasukan) {
    warnaJumlah = warna.pemasukan;
    ikon = 'arrow-down';
    simbol = '+';
  } else if (isTransfer) {
    warnaJumlah = warna.transfer;
    ikon = 'swap-horizontal';
    simbol = ''; // Transfer netral
    // FIX: Memberikan fallback jika nama_dompet_tujuan null/undefined
    namaTampilan = `Transfer ke ${transaksi.nama_dompet_tujuan ?? 'Dompet'}`;
  }

  return (
    <View style={gaya.penampung}>
      <View style={[gaya.ikonPenampung, { backgroundColor: warnaJumlah, opacity: 0.2 }]}>
        <Ionicons name={ikon} size={20} color={warnaJumlah} />
      </View>
      <View style={gaya.infoPenampung}>
        <Text style={gaya.nama}>{namaTampilan}</Text>
        <Text style={gaya.dompet}>{transaksi.nama_dompet}</Text>
      </View>
      <View style={gaya.jumlahPenampung}>
        <Text style={[gaya.jumlah, { color: warnaJumlah }]}>
          {simbol} {formatAngka(transaksi.jumlah)}
        </Text>
      </View>
    </View>
  );
}

const warna = {
  pemasukan: '#16a34a', // hijau
  pengeluaran: '#dc2626', // merah
  transfer: '#2563eb', // biru
  teksUtama: '#1f2937',
  teksSekunder: '#6b7280',
  border: '#e5e7eb',
};

const gaya = StyleSheet.create({
  penampung: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  ikonPenampung: {
    width: 40,
    height: 40,
    borderRadius: 20, // lingkaran
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoPenampung: {
    flex: 1,
    justifyContent: 'center',
  },
  nama: {
    fontSize: 16,
    fontWeight: '600',
    color: warna.teksUtama,
    marginBottom: 2,
  },
  dompet: {
    fontSize: 14,
    color: warna.teksSekunder,
  },
  jumlahPenampung: {
    alignItems: 'flex-end',
  },
  jumlah: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
