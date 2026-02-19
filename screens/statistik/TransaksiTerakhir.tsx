// screens/statistik/TransaksiTerakhir.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaksi, Kategori, Dompet } from '@/database/tipe';
import { WARNA } from './konstanta';
import { formatRupiah } from './util';

interface TransaksiTerakhirProps {
  transaksi: Transaksi[];
  kategori: Kategori[];
  dompet: Dompet[];
}

export const TransaksiTerakhir = ({ transaksi, kategori, dompet }: TransaksiTerakhirProps) => (
  <View style={[styles.seksi, { marginBottom: 32 }]}>
    <Text style={styles.judulSeksi}>Transaksi Terakhir</Text>
    {transaksi.slice(0, 5).map((t) => {
      const kat = kategori.find((k) => k.id === t.kategori_id);
      const dom = dompet.find((d) => d.id === t.dompet_id);
      const isPemasukan = kat?.tipe === 'pemasukan';
      return (
        <View key={t.id} style={styles.itemTransaksi}>
          <View style={styles.ikonTransaksi}>
            <Text style={{ fontSize: 18 }}>{kat?.ikon ?? '💸'}</Text>
          </View>
          <View style={styles.infoTransaksi}>
            <Text style={styles.namaTransaksi}>{kat?.nama ?? 'Tanpa Kategori'}</Text>
            <Text style={styles.detailTransaksi}>
              {dom?.nama ?? '—'} · {t.tanggal.slice(0, 10)}
            </Text>
            {t.keterangan ? (
              <Text style={styles.keteranganTransaksi} numberOfLines={1}>
                {t.keterangan}
              </Text>
            ) : null}
          </View>
          <Text
            style={[
              styles.jumlahTransaksi,
              { color: isPemasukan ? WARNA.hijau : WARNA.merah },
            ]}
          >
            {isPemasukan ? '+' : '-'}
            {formatRupiah(t.jumlah)}
          </Text>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  seksi: {
    backgroundColor: WARNA.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: WARNA.border,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  judulSeksi: {
    fontSize: 16,
    fontWeight: '700',
    color: WARNA.teksUtama,
    marginBottom: 16,
  },
  itemTransaksi: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: WARNA.border,
  },
  ikonTransaksi: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTransaksi: {
    flex: 1,
  },
  namaTransaksi: {
    fontSize: 14,
    fontWeight: '600',
    color: WARNA.teksUtama,
    marginBottom: 2,
  },
  detailTransaksi: {
    fontSize: 12,
    color: WARNA.teksTersier,
  },
  keteranganTransaksi: {
    fontSize: 11,
    color: WARNA.teksSekunder,
    marginTop: 2,
  },
  jumlahTransaksi: {
    fontSize: 14,
    fontWeight: '700',
  },
});
