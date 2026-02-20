// screens/transaksi/DaftarTransaksi.tsx

import KartuTransaksi from '@/components/KartuTransaksi';
import { Transaksi } from '@/database/tipe';
import { formatTanggal } from '@/utils/format/FormatTanggal';
import { formatMataUang } from '@/utils/formatMataUang';
import { grupTransaksiUrutTanggal } from '@/utils/transaksi/GrupTransaksi';
import React from 'react';
import { Dimensions, SectionList, StyleSheet, Text, View } from 'react-native';

interface DaftarTransaksiProps {
  transaksi: Transaksi[];
  onPressItem: (id: number) => void;
}

const { width } = Dimensions.get('window');

const DaftarTransaksi: React.FC<DaftarTransaksiProps> = ({ transaksi, onPressItem }) => {
  const sections = grupTransaksiUrutTanggal(transaksi);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      stickySectionHeadersEnabled={true}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => <KartuTransaksi transaksi={item} onPress={onPressItem} />}
      renderSectionHeader={({ section: { title, data } }) => {
        // Hitung ringkasan harian
        const totalHarian = data.reduce((acc, curr) => {
          return curr.tipe === 'pemasukan' ? acc + curr.nominal : acc - curr.nominal;
        }, 0);

        return (
          <View style={styles.headerContainer}>
            <View style={styles.headerBlur}>
              <View style={styles.tglBox}>
                <Text style={styles.textHari}>{formatTanggal(title).split(',')[0]}</Text>
                <Text style={styles.textTanggal}>{title.split('-')[2]}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.textBulanTahun}>{formatTanggal(title).split(',')[1]}</Text>
                <Text
                  style={[
                    styles.textTotalHarian,
                    { color: totalHarian >= 0 ? '#2E7D32' : '#C62828' },
                  ]}
                >
                  {totalHarian >= 0 ? '+' : ''}
                  {formatMataUang(totalHarian)}
                </Text>
              </View>
            </View>
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
  },
  headerContainer: {
    backgroundColor: '#F8F9FA', // Warna background layar
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  headerBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    // Shadow halus untuk header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tglBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 45,
  },
  textHari: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78909C',
    textTransform: 'uppercase',
  },
  textTanggal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#263238',
  },
  infoBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBulanTahun: {
    fontSize: 14,
    fontWeight: '600',
    color: '#455A64',
  },
  textTotalHarian: {
    fontSize: 13,
    fontWeight: '700',
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
