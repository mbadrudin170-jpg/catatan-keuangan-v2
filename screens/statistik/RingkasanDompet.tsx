// screens/statistik/RingkasanDompet.tsx
import { Dompet } from '@/database/tipe';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { WARNA } from './konstanta';
import { formatRupiah } from './util';

interface RingkasanDompetProps {
  dompet: Dompet[];
}

export const RingkasanDompet = ({ dompet }: RingkasanDompetProps) => (
  <View style={styles.seksi}>
    <View style={styles.headerRow}>
      <Text style={styles.judulSeksi}>Dompet</Text>
      <Text style={styles.jumlahDompet}>{dompet.length} Dompet</Text>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {dompet.map((d, i) => {
        const warna = WARNA.aksen[i % WARNA.aksen.length];

        return (
          <View key={d.id} style={[styles.kartuDompet, { borderColor: `${warna}25` }]}>
            <View style={styles.topRow}>
              <View style={[styles.ikonDompet, { backgroundColor: `${warna}18` }]}>
                <Text style={styles.teksIkon}>{d.ikon}</Text>
              </View>

              <View style={[styles.badgeTipe, { backgroundColor: `${warna}15` }]}>
                <Text style={[styles.teksBadge, { color: warna }]}>{d.tipe}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.namaDompet} numberOfLines={1}>
                {d.nama}
              </Text>

              <Text style={[styles.saldoDompet, { color: warna }]}>{formatRupiah(d.saldo)}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  seksi: {
    backgroundColor: WARNA.surface,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: WARNA.border,

    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  judulSeksi: {
    fontSize: 18,
    fontWeight: '800',
    color: WARNA.teksUtama,
    letterSpacing: 0.3,
  },

  jumlahDompet: {
    fontSize: 12,
    fontWeight: '600',
    color: WARNA.teksSekunder,
  },

  scrollContainer: {
    paddingRight: 8,
  },

  kartuDompet: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    padding: 18,
    marginRight: 14,
    width: 165,
    borderWidth: 1,

    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  ikonDompet: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  teksIkon: {
    fontSize: 22,
  },

  badgeTipe: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  teksBadge: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  infoSection: {
    marginTop: 4,
  },

  namaDompet: {
    fontSize: 15,
    fontWeight: '700',
    color: WARNA.teksUtama,
    marginBottom: 6,
  },

  saldoDompet: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
