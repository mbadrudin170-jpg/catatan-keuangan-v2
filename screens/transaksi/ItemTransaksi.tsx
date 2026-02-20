// screens/transaksi/ItemTransaksi.tsx
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import type { Transaksi } from '@/database/tipe';
import { formatAngka } from '@/utils/format/FormatAngka';

interface Props {
  item: Transaksi;
}

export default function ItemTransaksi({ item }: Props) {
  const { daftarKategori } = useKategori();
  const { daftarDompet } = useDompet();

  const semuaSubkategori = daftarKategori.flatMap((k) => k.subkategori);
  const subkategori = semuaSubkategori.find((s) => s.id === item.kategori_id);
  const kategoriInduk = daftarKategori.find((k) => k.id === subkategori?.kategori_id);
  const dompet = daftarDompet.find((d) => d.id === item.dompet_id);

  const namaKategori = subkategori?.nama || 'Lainnya';
  const namaDompet = dompet?.nama || '-';

  const isPemasukkan = kategoriInduk?.tipe === 'pemasukan';
  const warnaNominal = { color: isPemasukkan ? '#10b981' : '#ef4444' };
  const tanda = isPemasukkan ? '+' : '-';

  // Fungsi untuk menangani navigasi ke halaman detail
  const bukaDetail = () => {
    router.push(`/transaksi/${item.id}`);
  };

  return (
    <Pressable style={gaya.wadah} onPress={bukaDetail}>
      <View style={gaya.infoKiri}>
        <Text style={gaya.teksNama} numberOfLines={1}>
          {item.keterangan}
        </Text>
        <Text style={gaya.teksKategori}>{`${namaKategori} · ${namaDompet}`}</Text>
      </View>
      <Text style={[gaya.teksNominal, warnaNominal]}>
        {tanda} {formatAngka(item.jumlah)}
      </Text>
    </Pressable>
  );
}

const gaya = StyleSheet.create({
  // BARU: Gaya untuk header grup
  headerGrup: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  // Gaya lama yang dipercantik
  wadah: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  infoKiri: {
    flex: 1,
    marginRight: 12,
  },
  teksNama: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  teksKategori: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  teksNominal: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
});
