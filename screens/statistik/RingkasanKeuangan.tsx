// screens/statistik/RingkasanKeuangan.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DonutChart } from './DonutChart';
import { GrafikBatang } from './GrafikBatang';
import { WARNA } from './konstanta';
import { useStatistik } from './StatistikContext'; // DIUBAH

export const RingkasanKeuangan = () => {
  // Ambil data langsung dari context, bukan props
  const { totalPemasukan, totalPengeluaran, dataGrafik } = useStatistik();

  const saldo = totalPemasukan - totalPengeluaran;
  const formatRupiah = (nilai: number) => 'Rp ' + nilai.toLocaleString('id-ID');

  return (
    <>
      {/* Seksi Proporsi Keuangan */}
      <View style={styles.seksi}>
        <Text style={styles.judulSeksi}>Proporsi Keuangan</Text>
        <DonutChart pemasukan={totalPemasukan} pengeluaran={totalPengeluaran} />

        {/* Ringkasan angka di bawah donut */}
        <View style={styles.ringkasanDonut}>
          <View style={styles.itemRingkasan}>
            <Text style={styles.labelRingkasan}>Pemasukan</Text>
            <Text style={[styles.nilaiRingkasan, { color: WARNA.HIJAU }]}>
              {formatRupiah(totalPemasukan)}
            </Text>
          </View>
          <View style={styles.itemRingkasan}>
            <Text style={styles.labelRingkasan}>Pengeluaran</Text>
            <Text style={[styles.nilaiRingkasan, { color: WARNA.MERAH }]}>
              {formatRupiah(totalPengeluaran)}
            </Text>
          </View>
          <View style={styles.itemRingkasan}>
            <Text style={styles.labelRingkasan}>Saldo</Text>
            <Text
              style={[
                styles.nilaiRingkasan,
                { color: saldo >= 0 ? WARNA.HIJAU : WARNA.MERAH },
              ]}
            >
              {formatRupiah(saldo)}
            </Text>
          </View>
        </View>
      </View>

      {/* Seksi Arus Kas */}
      <View style={styles.seksiArusKas}>
        <View style={styles.headerSeksi}>
          <Text style={styles.judulSeksi}>Arus Kas</Text>
        </View>
        {/* Grafik sekarang dibungkus untuk diberi margin vertikal */}
        <View style={{ marginVertical: 8 }}>
          <GrafikBatang data={dataGrafik} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  seksi: {
    backgroundColor: WARNA.SURFACE,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20, // TAMBAH
    marginBottom: 16,
    borderWidth: 1,
    borderColor: WARNA.BORDER,
    overflow: 'hidden', // Memastikan shadow tidak terpotong
  },
  seksiArusKas: {
    // Dibuat style terpisah agar padding tidak mempengaruhi grafik
    backgroundColor: WARNA.SURFACE,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20, // TAMBAH
    marginBottom: 16,
    borderWidth: 1,
    borderColor: WARNA.BORDER,
  },
  headerSeksi: {
    marginBottom: 16,
  },
  judulSeksi: {
    fontSize: 18,
    fontWeight: '700',
    color: WARNA.TEKS_UTAMA,
  },
  ringkasanDonut: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: WARNA.BORDER,
  },
  itemRingkasan: {
    alignItems: 'center',
  },
  labelRingkasan: {
    fontSize: 12,
    color: WARNA.TEKS_SEKUNDER,
    marginBottom: 4,
  },
  nilaiRingkasan: {
    fontSize: 14,
    fontWeight: '600',
  },
});
