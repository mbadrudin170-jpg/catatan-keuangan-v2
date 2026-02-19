// screens/detail-transaksi/ScreenDetailTransaksi.tsx
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import { formatAngka } from '@/utils/format/FormatAngka';

export default function ScreenDetailTransaksi() {
  const { id: transaksiId } = useLocalSearchParams<{ id: string }>();
  const { daftarTransaksi } = useTransaksi();
  const { daftarKategori } = useKategori();
  const { daftarDompet } = useDompet();

  // DIUBAH: Konversi `transaksiId` dari string ke number untuk perbandingan yang benar
  const transaksi = daftarTransaksi.find((t) => t.id === Number(transaksiId));

  if (!transaksi) {
    return (
      <SafeAreaView style={gaya.penampung}>
        <View style={gaya.kontenKosong}>
          <Text>Transaksi tidak ditemukan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const semuaSubkategori = daftarKategori.flatMap((k) => k.subkategori);
  const subkategori = semuaSubkategori.find((s) => s.id === transaksi.kategori_id);
  const kategoriInduk = daftarKategori.find((k) => k.id === subkategori?.kategori_id);
  const dompet = daftarDompet.find((d) => d.id === transaksi.dompet_id);
  const dompetTujuan = daftarDompet.find((d) => d.id === transaksi.dompet_tujuan_id);

  const namaKategori = subkategori?.nama || 'Lainnya';
  const namaDompet = dompet?.nama || '-';
  const namaDompetTujuan = dompetTujuan?.nama;

  const isPemasukkan = transaksi.tipe === 'pemasukan';
  const isTransfer = transaksi.tipe === 'transfer';

  let warnaNominal = '#ef4444'; // Default pengeluaran
  let tanda = '-';
  if (isPemasukkan) {
    warnaNominal = '#10b981';
    tanda = '+';
  } else if (isTransfer) {
    warnaNominal = '#3b82f6';
    tanda = ''; // Transfer tidak memiliki tanda +/-
  }

  return (
    <SafeAreaView style={gaya.penampung}>
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
    overflow: 'hidden', // Agar border-radius diterapkan pada anak-anaknya
  },
  barisDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eef2ff', // Warna border yang lebih lembut
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
