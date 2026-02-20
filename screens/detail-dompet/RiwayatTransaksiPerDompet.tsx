// screens/detail-dompet/RiwayatTransaksiPerDompet.tsx

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

  let warnaNominal = warna.merah; // Pengeluaran (default)
  let tanda = '-';
  // Menggunakan nama_subkategori atau nama_kategori dari transaksi
  let keteranganAtas = item.keterangan || item.nama_subkategori || item.nama_kategori || 'Lainnya';
  // Menampilkan subkategori jika keterangan ada
  let keteranganBawah = item.keterangan ? item.nama_subkategori || item.nama_kategori : undefined;

  if (isPemasukkan) {
    warnaNominal = warna.hijau; // Hijau untuk pemasukan
    tanda = '+';
  } else if (isTransfer) {
    warnaNominal = warna.biru; // Biru untuk transfer
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
    <Pressable
      style={({ pressed }) => [gayaItem.wadah, pressed && gayaItem.wadahTekan]}
      onPress={() => router.push(`/transaksi/${item.id}`)}
      android_ripple={{ color: warna.abuRipple, borderless: false }}
    >
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
  const { semuaTransaksi } = useTransaksi();

  // Memfilter dan mengelompokkan transaksi yang relevan dengan dompet ini
  const transaksiTergrup = useMemo(() => {
    const transaksiTersaring = semuaTransaksi.filter(
      (t: Transaksi) => t.dompet_id === dompetId || t.dompet_tujuan_id === dompetId
    );

    const grup = groupBy(transaksiTersaring, (t: Transaksi) =>
      format(new Date(t.tanggal), 'yyyy-MM-dd')
    );

    // Mengubah format agar sesuai dengan SectionList dan mengurutkan berdasarkan tanggal
    return Object.keys(grup)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((tanggal) => ({
        title: tanggal,
        data: grup[tanggal].sort(
          (a: Transaksi, b: Transaksi) =>
            new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        ),
      }));
  }, [semuaTransaksi, dompetId]);

  return (
    <View style={gaya.wadah}>
      <Text style={gaya.judul}>Riwayat Transaksi</Text>
      <SectionList
        sections={transaksiTergrup}
        keyExtractor={(item: Transaksi) => item.id.toString()}
        renderItem={({ item }) => <ItemRiwayat item={item as Transaksi} dompetId={dompetId} />}
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

// Palet warna dengan nama dalam bahasa Indonesia
const warna = {
  latar: '#ffffff',
  latarSekunder: '#f8fafc',
  teksUtama: '#0f172a', // biru sangat gelap
  teksSekunder: '#64748b', // abu-abu biru
  border: '#f1f5f9',
  merah: '#ef4444',
  hijau: '#10b981',
  biru: '#3b82f6',
  abuRipple: '#cbd5e1',
  bayangan: '#000000',
};

// Gaya untuk komponen utama
const gaya = StyleSheet.create({
  wadah: {
    marginTop: 24,
    paddingHorizontal: 16,
    flex: 1,
  },
  judul: {
    fontSize: 18,
    fontWeight: '700',
    color: warna.teksUtama,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  headerBagian: {
    fontSize: 14,
    fontWeight: '600',
    color: warna.teksSekunder,
    backgroundColor: warna.latarSekunder,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  penampungKosong: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: warna.latar,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: warna.bayangan,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  teksKosong: {
    fontSize: 15,
    color: warna.teksSekunder,
  },
});

// Gaya untuk setiap item transaksi
const gayaItem = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: warna.latar,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
  },
  wadahTekan: {
    backgroundColor: '#f1f5f9', // efek tekan ringan
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  keterangan: {
    fontSize: 15,
    fontWeight: '600',
    color: warna.teksUtama,
    marginBottom: 2,
  },
  subKeterangan: {
    fontSize: 13,
    color: warna.teksSekunder,
  },
  nominal: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
