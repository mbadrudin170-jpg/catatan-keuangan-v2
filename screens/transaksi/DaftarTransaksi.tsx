// screens/transaksi/DaftarTransaksi.tsx
import { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import { formatAngka } from '@/utils/format/FormatAngka';
import { grupTransaksiBerdasarkanTanggal } from '@/utils/transaksi/GrupTransaksi';
import ItemTransaksi from './ItemTransaksi';

export default function DaftarTransaksi() {
  const { daftarTransaksi } = useTransaksi();
  const { daftarKategori } = useKategori();

  // DIUBAH: Menggunakan useMemo untuk mengelompokkan data hanya saat daftar berubah
  const seksiTransaksi = useMemo(() => {
    // Hanya mengambil id dan tipe untuk efisiensi
    const infoKategori = daftarKategori.map(({ id, tipe }) => ({ id, tipe }));
    return grupTransaksiBerdasarkanTanggal(daftarTransaksi, infoKategori);
  }, [daftarTransaksi, daftarKategori]);

  if (seksiTransaksi.length === 0) {
    return (
      <View style={gaya.penampungKosong}>
        <Text style={gaya.teksKosong}>Belum ada riwayat transaksi.</Text>
      </View>
    );
  }

  // DIUBAH: Mengganti FlatList dengan SectionList untuk tampilan grup
  return (
    <SectionList
      sections={seksiTransaksi}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ItemTransaksi item={item} />}
      renderSectionHeader={({ section: { tanggal, total } }) => (
        <View style={gaya.headerGrup}>
          <Text style={gaya.teksTanggalGrup}>{tanggal}</Text>
          <Text style={gaya.teksTotalGrup}>{formatAngka(total, { denganTanda: true })}</Text>
        </View>
      )}
      contentContainerStyle={gaya.daftar}
      showsVerticalScrollIndicator={false}
    />
  );
}

const gaya = StyleSheet.create({
  daftar: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  // BARU: Gaya untuk header grup di SectionList
  headerGrup: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc', // Warna latar belakang agar header menonjol
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
  penampungKosong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  teksKosong: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
    letterSpacing: -0.2,
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
});
