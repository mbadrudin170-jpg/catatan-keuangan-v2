// screens/detail-transaksi/ScreenDetailTransaksi.tsx
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatAngka } from '@/utils/format/FormatAngka';
import HeaderDetailTransaksi from './HeaderDetailTransaksi';
import { useDetailTransaksi } from './logikaDetailTransaksi';

export default function ScreenDetailTransaksi() {
  const data = useDetailTransaksi();

  // Jika data tidak ditemukan (misal, ID transaksi tidak valid)
  if (!data) {
    return (
      <SafeAreaView style={gaya.penampung}>
        <HeaderDetailTransaksi />
        <View style={gaya.kontenKosong}>
          <Text>Transaksi tidak ditemukan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Destructuring data untuk kemudahan akses
  const { transaksi, isTransfer, namaDompet, namaDompetTujuan, namaKategori, warnaNominal, tanda } =
    data;

  return (
    <SafeAreaView style={gaya.penampung}>
      <HeaderDetailTransaksi />
      <View style={gaya.areaNominal}>
        <Text style={[gaya.teksNominal, { color: warnaNominal }]}>
          {tanda} {formatAngka(transaksi.jumlah)}
        </Text>
        <Text style={gaya.teksKeterangan}>{transaksi.keterangan || '-'}</Text>
      </View>

      <View style={gaya.areaDetail}>
        <View style={gaya.barisDetail}>
          <Text style={gaya.labelDetail}>Tanggal</Text>
          <Text style={gaya.nilaiDetail}>
            {format(new Date(transaksi.tanggal), 'EEEE, dd MMMM yyyy', { locale: id })}
          </Text>
        </View>
        <View style={gaya.barisDetail}>
          <Text style={gaya.labelDetail}>Waktu</Text>
          <Text style={gaya.nilaiDetail}>{format(new Date(transaksi.tanggal), 'HH:mm')}</Text>
        </View>

        {isTransfer ? (
          <>
            <View style={gaya.barisDetail}>
              <Text style={gaya.labelDetail}>Dari Dompet</Text>
              <Text style={gaya.nilaiDetail}>{namaDompet}</Text>
            </View>
            <View style={gaya.barisDetail}>
              <Text style={gaya.labelDetail}>Ke Dompet</Text>
              <Text style={gaya.nilaiDetail}>{namaDompetTujuan}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={gaya.barisDetail}>
              <Text style={gaya.labelDetail}>Kategori</Text>
              <Text style={gaya.nilaiDetail}>{namaKategori}</Text>
            </View>
            <View style={gaya.barisDetail}>
              <Text style={gaya.labelDetail}>Dompet</Text>
              <Text style={gaya.nilaiDetail}>{namaDompet}</Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// Gaya tidak berubah, tetap sama seperti sebelumnya
const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  kontenKosong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaNominal: {
    padding: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  teksNominal: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  teksKeterangan: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  areaDetail: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  barisDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eef2ff',
  },
  labelDetail: {
    fontSize: 15,
    color: '#64748b',
  },
  nilaiDetail: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
});
