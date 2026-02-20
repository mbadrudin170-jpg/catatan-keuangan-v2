// ~/catatan-keuangan-v2/screens/detail-dompet/RiwayatTransaksiPerDompet.tsx

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { useTransaksi } from '@/context/TransaksiContext';
import type { Transaksi } from '@/database/tipe';
import { formatAngka } from '@/utils/format/FormatAngka';

// Helper sederhana untuk mengelompokkan array objek berdasarkan kunci
const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

/**
 * Komponen `ItemRiwayat` menampilkan satu baris transaksi dalam daftar.
 * Ia bertanggung jawab untuk menampilkan detail transaksi dan menangani navigasi.
 */
function ItemRiwayat({ item, dompetId }: { item: Transaksi; dompetId: number }) {
  // Menentukan detail tampilan berdasarkan tipe transaksi
  const isPemasukkan = item.tipe === 'pemasukan';
  const isTransfer = item.tipe === 'transfer';
  const isTransferMasuk = isTransfer && item.dompet_tujuan_id === dompetId;

  let warnaNominal = '#ef4444'; // Pengeluaran (default)
  let tanda = '-';
  // Menggunakan nama_subkategori atau nama_kategori dari transaksi
  let keteranganAtas = item.keterangan || item.nama_subkategori || item.nama_kategori || 'Lainnya';
  // Menampilkan subkategori jika keterangan ada
  let keteranganBawah = item.keterangan ? item.nama_subkategori || item.nama_kategori : undefined;

  if (isPemasukkan) {
    warnaNominal = '#10b981'; // Hijau untuk pemasukan
    tanda = '+';
  } else if (isTransfer) {
    warnaNominal = '#3b82f6'; // Biru untuk transfer
    if (isTransferMasuk) {
      tanda = '+';
      // Menampilkan nama dompet pengirim
      keteranganAtas = `Transfer dari ${item.nama_dompet || 'Lainnya'}`;
    } else {
      tanda = '-';
      // Menampilkan nama dompet tujuan
      keteranganAtas = `Transfer ke ${item.nama_dompet_tujuan || 'Lainnya'}`;
    }
    // Keterangan transaksi transfer tetap ditampilkan
    keteranganBawah = item.keterangan;
  }

  return (
    <Pressable style={gayaItem.wadah} onPress={() => router.push(`/transaksi/${item.id}`)}>
      <View style={gayaItem.info}>
        <Text style={gayaItem.keterangan}>{keteranganAtas}</Text>
        {keteranganBawah && <Text style={gayaItem.subKeterangan}>{keteranganBawah}</Text>}
      </View>
      <Text style={[gayaItem.nominal, { color: warnaNominal }]}>
        {tanda} {formatAngka(item.jumlah)}
      </Text>
    </Pressable>
  );
}

/**
 * Komponen utama `RiwayatTransaksiPerDompet`.
 * Mengambil data, memfilternya, dan menampilkannya dalam SectionList.
 */
export default function RiwayatTransaksiPerDompet({ dompetId }: { dompetId: number }) {
  const { daftarTransaksi } = useTransaksi();

  // Memfilter dan mengelompokkan transaksi yang relevan dengan dompet ini
  const transaksiTergrup = useMemo(() => {
    const transaksiTersaring = daftarTransaksi.filter(
      (t) => t.dompet_id === dompetId || t.dompet_tujuan_id === dompetId
    );

    const grup = groupBy(transaksiTersaring, (t) => format(new Date(t.tanggal), 'yyyy-MM-dd'));

    // Mengubah format agar sesuai dengan SectionList dan mengurutkan berdasarkan tanggal
    return Object.keys(grup)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((tanggal) => ({
        title: tanggal,
        data: grup[tanggal].sort(
          (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        ),
      }));
  }, [daftarTransaksi, dompetId]);

  return (
    <View style={gaya.wadah}>
      <Text style={gaya.judul}>Riwayat Transaksi</Text>
      <SectionList
        sections={transaksiTergrup}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ItemRiwayat item={item} dompetId={dompetId} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={gaya.headerBagian}>
            {format(new Date(title), 'EEEE, dd MMMM yyyy', { locale: id })}
          </Text>
        )}
        ListEmptyComponent={
          <View style={gaya.penampungKosong}>
            <Text style={gaya.teksKosong}>Belum ada transaksi di dompet ini.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Gaya untuk komponen utama
const gaya = StyleSheet.create({
  wadah: {
    marginTop: 24,
    paddingHorizontal: 16,
    flex: 1,
  },
  judul: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  headerBagian: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    marginTop: 8,
  },
  penampungKosong: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
  },
  teksKosong: {
    fontSize: 15,
    color: '#64748b',
  },
});

// Gaya untuk setiap item transaksi
const gayaItem = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  keterangan: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  subKeterangan: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  nominal: {
    fontSize: 16,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
});
