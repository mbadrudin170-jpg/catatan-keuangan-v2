// screens/statistik/TransaksiTerakhir.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WARNA } from './konstanta';
import { useStatistik } from './StatistikContext'; // DIUBAH
import { formatRupiah } from './util';

export const TransaksiTerakhir = () => {
  // Ambil data langsung dari context, bukan props
  const { daftarTransaksi, daftarKategori, daftarDompet } = useStatistik();

  return (
    <View style={[styles.seksi, { marginBottom: 32 }]}>
      <Text style={styles.judulSeksi}>Transaksi Terakhir</Text>
      {/* Gunakan data dari context */}
      {daftarTransaksi.slice(0, 5).map((t) => {
        const kat = daftarKategori.find((k) => k.id === t.kategori_id);
        const dom = daftarDompet.find((d) => d.id === t.dompet_id);
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
              style={[styles.jumlahTransaksi, { color: isPemasukan ? WARNA.HIJAU : WARNA.MERAH }]}
            >
              {isPemasukan ? '+' : '-'}
              {formatRupiah(t.jumlah)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  seksi: {
    backgroundColor: WARNA.SURFACE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: WARNA.BORDER,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  judulSeksi: {
    fontSize: 16,
    fontWeight: '700',
    color: WARNA.TEKS_UTAMA,
    marginBottom: 16,
  },
  itemTransaksi: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: WARNA.BORDER,
  },
  ikonTransaksi: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: WARNA.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTransaksi: {
    flex: 1,
  },
  namaTransaksi: {
    fontSize: 14,
    fontWeight: '600',
    color: WARNA.TEKS_UTAMA,
    marginBottom: 2,
  },
  detailTransaksi: {
    fontSize: 12,
    color: WARNA.TEKS_TERSIER,
  },
  keteranganTransaksi: {
    fontSize: 11,
    color: WARNA.TEKS_SEKUNDER,
    marginTop: 2,
  },
  jumlahTransaksi: {
    fontSize: 14,
    fontWeight: '700',
  },
});
