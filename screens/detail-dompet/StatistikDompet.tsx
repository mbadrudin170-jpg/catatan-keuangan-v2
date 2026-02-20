// screens/detail-dompet/StatistikDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatMataUang } from '@/utils/formatMataUang';
import { useDetailDompet } from './logikaDetailDompet';

export default function StatistikDompet() {
  const { saldo, pemasukan, pengeluaran } = useDetailDompet();

  // Tampilkan komponen hanya jika semua data sudah siap
  if (saldo === undefined || pemasukan === undefined || pengeluaran === undefined) {
    return null;
  }

  return (
    <View style={gaya.penampung}>
      {/* Bagian Saldo Total */}
      <View style={gaya.saldoPenampung}>
        <Text style={gaya.saldoLabel}>Total Saldo</Text>
        <Text style={gaya.saldoJumlah}>{formatMataUang(saldo)}</Text>
      </View>

      {/* Ringkasan Pemasukan & Pengeluaran */}
      <View style={gaya.detailPenampung}>
        {/* Pemasukan */}
        <View style={gaya.detailItem}>
          <View style={gaya.ikonTeksPenampung}>
            <Ionicons name="arrow-down-circle-outline" size={24} color={warna.hijau} />
            <Text style={gaya.detailLabel}>Pemasukan</Text>
          </View>
          <Text style={[gaya.detailJumlah, gaya.pemasukan]}>+ {formatMataUang(pemasukan)}</Text>
        </View>

        {/* Pengeluaran */}
        <View style={gaya.detailItem}>
          <View style={gaya.ikonTeksPenampung}>
            <Ionicons name="arrow-up-circle-outline" size={24} color={warna.merah} />
            <Text style={gaya.detailLabel}>Pengeluaran</Text>
          </View>
          <Text style={[gaya.detailJumlah, gaya.pengeluaran]}>- {formatMataUang(pengeluaran)}</Text>
        </View>
      </View>
    </View>
  );
}

// Palet warna dengan nama dalam bahasa Indonesia
const warna = {
  latar: '#ffffff',
  teksUtama: '#1f2937', // abu-abu gelap
  teksSekunder: '#6b7280', // abu-abu terang
  border: '#f3f4f6', // abu-abu sangat terang
  hijau: '#10b981', // hijau untuk pemasukan
  merah: '#ef4444', // merah untuk pengeluaran
  bayangan: '#000000',
};

const gaya = StyleSheet.create({
  penampung: {
    backgroundColor: warna.latar,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    // Bayangan halus
    shadowColor: warna.bayangan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  saldoPenampung: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingBottom: 20,
  },
  saldoLabel: {
    fontSize: 14,
    color: warna.teksSekunder,
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  saldoJumlah: {
    fontSize: 34,
    fontWeight: '700', // bold tebal
    color: warna.teksUtama,
  },
  detailPenampung: {
    gap: 16, // jarak antar item
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ikonTeksPenampung: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: warna.teksUtama,
    fontWeight: '500',
  },
  detailJumlah: {
    fontSize: 16,
    fontWeight: '600',
  },
  pemasukan: {
    color: warna.hijau,
  },
  pengeluaran: {
    color: warna.merah,
  },
});
