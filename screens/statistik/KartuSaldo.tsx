// screens/statistik/KartuSaldo.tsx

import { formatMataUang } from '@/utils/formatMataUang';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface KartuSaldoProps {
  totalSaldo: number;
  totalPemasukan: number;
  totalPengeluaran: number;
}

const { width } = Dimensions.get('window');

const KartuSaldo: React.FC<KartuSaldoProps> = ({
  totalSaldo,
  totalPemasukan,
  totalPengeluaran,
}) => {
  return (
    <View style={styles.container}>
      {/* Bagian Saldo Utama */}
      <View style={styles.header}>
        <Text style={styles.labelUtama}>Total Saldo</Text>
        <Text style={styles.nilaiSaldo}>{formatMataUang(totalSaldo)}</Text>
      </View>

      <View style={styles.garisPemisah} />

      {/* Bagian Pemasukan & Pengeluaran */}
      <View style={styles.row}>
        <View style={styles.item}>
          <View style={[styles.bgIkon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="arrow-down-outline" size={18} color="#2E7D32" />
          </View>
          <View>
            <Text style={styles.labelSub}>Pemasukan</Text>
            <Text style={[styles.nilaiSub, { color: '#2E7D32' }]}>
              {formatMataUang(totalPemasukan)}
            </Text>
          </View>
        </View>

        <View style={styles.item}>
          <View style={[styles.bgIkon, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="arrow-up-outline" size={18} color="#C62828" />
          </View>
          <View>
            <Text style={styles.labelSub}>Pengeluaran</Text>
            <Text style={[styles.nilaiSub, { color: '#C62828' }]}>
              {formatMataUang(totalPengeluaran)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A237E', // Deep Indigo untuk kesan premium
    padding: 24,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 10,
    // Modern Shadow
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  labelUtama: {
    fontSize: 14,
    color: '#C5CAE9',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 6,
  },
  nilaiSaldo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  garisPemisah: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bgIkon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  labelSub: {
    fontSize: 12,
    color: '#C5CAE9',
    marginBottom: 2,
  },
  nilaiSub: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default KartuSaldo;
