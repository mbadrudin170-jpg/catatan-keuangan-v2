// screens/statistik/RingkasanKeuangan.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DataGrafikBatang } from './data';
import { DonutChart } from './DonutChart';
import { GrafikBatang } from './GrafikBatang';
import { WARNA } from './konstanta';

interface RingkasanKeuanganProps {
  totalPemasukan: number;
  totalPengeluaran: number;
  dataGrafik: DataGrafikBatang[];
}

export const RingkasanKeuangan = ({
  totalPemasukan,
  totalPengeluaran,
  dataGrafik,
}: RingkasanKeuanganProps) => {
  const saldo = totalPemasukan - totalPengeluaran;
  const formatRupiah = (nilai: number) => 'Rp ' + nilai.toLocaleString('id-ID');

  return (
    <>
      {/* Seksi Proporsi Keuangan */}
      <View style={styles.seksi}>
        <Text style={styles.judulSeksi}>Proporsi Keuangan</Text>
        <DonutChart pemasukan={totalPemasukan} pengeluaran={totalPengeluaran} />

        {/* Ringkasan angka di bawah donut */}
        <View style={styles.summaryDonut}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pemasukan</Text>
            <Text style={[styles.summaryValue, { color: WARNA.hijau }]}>
              {formatRupiah(totalPemasukan)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pengeluaran</Text>
            <Text style={[styles.summaryValue, { color: WARNA.merah }]}>
              {formatRupiah(totalPengeluaran)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Saldo</Text>
            <Text style={[styles.summaryValue, { color: saldo >= 0 ? WARNA.hijau : WARNA.merah }]}>
              {formatRupiah(saldo)}
            </Text>
          </View>
        </View>
      </View>

      {/* Seksi Arus Kas */}
      <View style={styles.seksi}>
        <View style={styles.headerSeksi}>
          <Text style={styles.judulSeksi}>Arus Kas</Text>
          <View style={styles.legendaGrafik}>
            <View style={[styles.dotLegenda, { backgroundColor: WARNA.hijau }]} />
            <Text style={styles.teksLegenda}>Masuk</Text>
            <View style={[styles.dotLegenda, { backgroundColor: WARNA.merah }]} />
            <Text style={styles.teksLegenda}>Keluar</Text>
          </View>
        </View>
        <GrafikBatang data={dataGrafik} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  seksi: {
    backgroundColor: WARNA.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: WARNA.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerSeksi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  judulSeksi: {
    fontSize: 18,
    fontWeight: '700',
    color: WARNA.teksUtama,
  },
  legendaGrafik: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotLegenda: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  teksLegenda: {
    fontSize: 13,
    color: WARNA.teksSekunder,
    marginRight: 12,
  },
  summaryDonut: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: WARNA.border,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: WARNA.teksSekunder,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
