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
      <View style={gaya.saldoPenampung}>
        <Text style={gaya.saldoLabel}>Total Saldo</Text>
        <Text style={gaya.saldoJumlah}>{formatMataUang(saldo)}</Text>
      </View>

      <View style={gaya.detailPenampung}>
        {/* Pemasukan */}
        <View style={gaya.detailItem}>
          <View style={gaya.ikonTeksPenampung}>
            <Ionicons name="arrow-down-circle-outline" size={22} color="#10b981" />
            <Text style={gaya.detailLabel}>Pemasukan</Text>
          </View>
          <Text style={[gaya.detailJumlah, gaya.pemasukan]}>+ {formatMataUang(pemasukan)}</Text>
        </View>

        {/* Pengeluaran */}
        <View style={gaya.detailItem}>
          <View style={gaya.ikonTeksPenampung}>
            <Ionicons name="arrow-up-circle-outline" size={22} color="#ef4444" />
            <Text style={gaya.detailLabel}>Pengeluaran</Text>
          </View>
          <Text style={[gaya.detailJumlah, gaya.pengeluaran]}>
            - {formatMataUang(pengeluaran)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    // Shadow untuk iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow untuk Android
    elevation: 4,
  },
  saldoPenampung: {
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6', // Abu-abu sangat terang
    paddingBottom: 16,
  },
  saldoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  saldoJumlah: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937', // Abu-abu gelap
  },
  detailPenampung: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ikonTeksPenampung: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#374151',
  },
  detailJumlah: {
    fontSize: 16,
    fontWeight: '600',
  },
  pemasukan: {
    color: '#10b981', // Hijau
  },
  pengeluaran: {
    color: '#ef4444', // Merah
  },
});
