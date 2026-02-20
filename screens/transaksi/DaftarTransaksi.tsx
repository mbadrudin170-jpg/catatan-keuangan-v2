// screens/transaksi/DaftarTransaksi.tsx

import { Kategori, Transaksi } from '@/database/tipe';
import KartuTransaksi from '@/screens/transaksi/KartuTransaksi';
import { formatTanggal } from '@/utils/format/FormatTanggal';
import { formatMataUang } from '@/utils/formatMataUang';
import { grupTransaksiBerdasarkanTanggal } from '@/utils/transaksi/GrupTransaksi';
import { parseISO } from 'date-fns';
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

interface DaftarTransaksiProps {
  transaksi: Transaksi[];
  kategori: Kategori[];
  onPressItem: (id: number) => void;
}

const DaftarTransaksi: React.FC<DaftarTransaksiProps> = ({ transaksi, kategori, onPressItem }) => {
  const sections = grupTransaksiBerdasarkanTanggal(transaksi, kategori);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.id.toString() + index}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => <KartuTransaksi transaksi={item} />}
      renderSectionHeader={({ section: { tanggal, total } }) => {
        const tanggalObj = parseISO(tanggal);
        const [hari, sisaTanggal] = formatTanggal(tanggalObj).split(', ');

        return (
          <View style={styles.headerGrup}>
            <Text style={styles.teksTanggalGrup}>
              {hari}, {sisaTanggal}
            </Text>
            <Text style={styles.teksTotalGrup}>{formatMataUang(total)}</Text>
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada transaksi di periode ini</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  headerGrup: {
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 4, // Sedikit padding untuk teks
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  teksTanggalGrup: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  teksTotalGrup: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#90A4AE',
    fontSize: 14,
  },
});

export default DaftarTransaksi;
