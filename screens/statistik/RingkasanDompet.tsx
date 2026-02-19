// screens/statistik/RingkasanDompet.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WARNA } from './konstanta';
import { useStatistik } from './StatistikContext';
import { formatRupiah } from './util';

export const RingkasanDompet = () => {
  const { daftarDompet } = useStatistik();

  const totalSaldoKeseluruhan = daftarDompet.reduce(
    (total, dompet) => total + dompet.saldo,
    0
  );

  return (
    <View style={styles.seksi}>
      {/* Bagian Header tetap sama */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.judulSeksi}>Dompet</Text>
          <Text style={styles.labelTotalSaldo}>Total Saldo</Text>
          <Text style={styles.totalSaldo}>{formatRupiah(totalSaldoKeseluruhan)}</Text>
        </View>
        <Text style={styles.jumlahDompet}>{daftarDompet.length} Dompet</Text>
      </View>

      {/* Ganti ScrollView horizontal menjadi daftar vertikal */}
      <View style={styles.listContainer}>
        {daftarDompet.map((d, i) => {
          const warna = WARNA.AKSEN[i % WARNA.AKSEN.length];

          return (
            <View key={d.id} style={styles.itemDompet}>
              <View style={styles.infoDompet}>
                <Text style={styles.itemIkon}>{d.ikon}</Text>
                <Text style={styles.itemNama} numberOfLines={1}>
                  {d.nama}
                </Text>
              </View>
              <Text style={[styles.itemSaldo, { color: warna }]}>
                {formatRupiah(d.saldo)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Styles dirombak untuk mendukung tata letak daftar yang ringkas
const styles = StyleSheet.create({
  seksi: {
    backgroundColor: WARNA.SURFACE,
    borderRadius: 24,
    paddingVertical: 20,
    marginBottom: 18,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: WARNA.BORDER,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  judulSeksi: {
    fontSize: 16, // Disesuaikan
    fontWeight: '700',
    color: WARNA.TEKS_UTAMA,
    marginBottom: 2,
  },
  labelTotalSaldo: {
    fontSize: 12,
    color: WARNA.TEKS_SEKUNDER,
    fontWeight: '500',
  },
  totalSaldo: {
    fontSize: 18, // Disesuaikan
    fontWeight: '800',
    color: WARNA.HIJAU,
    letterSpacing: 0.5,
  },
  jumlahDompet: {
    fontSize: 12,
    fontWeight: '600',
    color: WARNA.TEKS_SEKUNDER,
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  itemDompet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: WARNA.BORDER,
  },
  infoDompet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1, // Memastikan nama tidak mendorong saldo keluar
  },
  itemIkon: {
    fontSize: 20,
  },
  itemNama: {
    fontSize: 14,
    fontWeight: '600',
    color: WARNA.TEKS_UTAMA,
    flex: 1,
  },
  itemSaldo: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
