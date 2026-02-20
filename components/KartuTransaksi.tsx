// components/KartuTransaksi.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaksi } from '@/database/tipe';
import { formatMataUang } from '@/utils/formatMataUang';
import { formatJam } from '@/utils/format/FormatJam';

interface KartuTransaksiProps {
  transaksi: Transaksi;
  onPress: (id: number) => void;
}

const KartuTransaksi: React.FC<KartuTransaksiProps> = ({ transaksi, onPress }) => {
  const isPengeluaran = transaksi.tipe === 'pengeluaran';

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => {
        onPress(transaksi.id);
      }}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.bgIcon, { backgroundColor: isPengeluaran ? '#FFEBEE' : '#E8F5E9' }]}>
          <Ionicons
            name={isPengeluaran ? 'arrow-up-circle' : 'arrow-down-circle'}
            size={28}
            color={isPengeluaran ? '#D32F2F' : '#388E3C'}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.rowUtama}>
          <Text style={styles.judul} numberOfLines={1}>
            {transaksi.nama_kategori}
          </Text>
          <Text style={[styles.nominal, { color: isPengeluaran ? '#D32F2F' : '#388E3C' }]}>
            {isPengeluaran ? '-' : '+'} {formatMataUang(transaksi.jumlah)}
          </Text>
        </View>

        <View style={styles.rowSub}>
          <Text style={styles.catatan} numberOfLines={1}>
            {transaksi.keterangan || 'Tanpa catatan'}
          </Text>
          <Text style={styles.jam}>{formatJam(new Date(transaksi.tanggal))}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 16,
    // Modern Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    marginRight: 14,
  },
  bgIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  rowUtama: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  judul: {
    fontSize: 16,
    fontWeight: '700',
    color: '#263238',
    flex: 1,
    marginRight: 8,
  },
  nominal: {
    fontSize: 15,
    fontWeight: '800',
  },
  rowSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catatan: {
    fontSize: 13,
    color: '#78909C',
    flex: 1,
    marginRight: 8,
  },
  jam: {
    fontSize: 12,
    color: '#B0BEC5',
    fontWeight: '500',
  },
});

export default KartuTransaksi;
